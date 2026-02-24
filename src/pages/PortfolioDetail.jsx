import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const normalizeName = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const slugify = (value) => normalizeName(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const getFileOrder = (fileName) => {
  const match = fileName.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

const buildPortfolioIndex = (assets) => {
  const categoriesMap = new Map();

  Object.entries(assets).forEach(([rawPath, src]) => {
    const path = rawPath.replace(/\\/g, '/');
    const match = path.match(/\/Portfolio\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!match) return;

    const [, categoryName, projectName, rest] = match;
    const restParts = rest.split('/');
    const fileName = restParts[restParts.length - 1];
    const subprojectName = restParts.length > 1 ? restParts[0] : null;

    const extMatch = fileName.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const type = ['mp4', 'webm'].includes(ext) ? 'video' : 'image';
    const order = getFileOrder(fileName);
    const nameKey = fileName.toLowerCase();

    const categorySlug = slugify(categoryName);
    const projectSlug = slugify(projectName);
    const slug = `${categorySlug}-${projectSlug}`;

    if (!categoriesMap.has(categorySlug)) {
      categoriesMap.set(categorySlug, {
        id: categorySlug,
        name: categoryName,
        projects: new Map(),
      });
    }

    const category = categoriesMap.get(categorySlug);
    if (!category.projects.has(slug)) {
      category.projects.set(slug, {
        slug,
        title: projectName,
        categoryId: categorySlug,
        categoryName,
        groups: new Map(),
      });
    }

    const project = category.projects.get(slug);
    const groupKey = subprojectName ? slugify(subprojectName) : 'default';
    if (!project.groups.has(groupKey)) {
      project.groups.set(groupKey, {
        name: subprojectName || 'Galeria',
        id: groupKey,
        items: [],
      });
    }

    project.groups.get(groupKey).items.push({
      id: `${slug}-${groupKey}-${nameKey}`,
      src,
      type,
      order,
      nameKey,
      alt: `${projectName} ${fileName}`,
    });
  });

  const categories = Array.from(categoriesMap.values())
    .map((category) => {
      const projects = Array.from(category.projects.values())
        .map((project) => {
          const groups = Array.from(project.groups.values())
            .map((group) => ({
              ...group,
              items: group.items
                .sort((a, b) => a.order - b.order || a.nameKey.localeCompare(b.nameKey))
                .map((item, index) => ({
                  id: index + 1,
                  src: item.src,
                  type: item.type,
                  alt: item.alt,
                })),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const cover = groups[0]?.items?.[0] || null;

          return {
            ...project,
            groups,
            items: groups.length === 1 ? groups[0].items : null,
            coverSrc: cover?.src || null,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      return { ...category, projects };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const projects = categories.flatMap((category) => category.projects);
  const projectsBySlug = projects.reduce((acc, project) => {
    acc[project.slug] = project;
    return acc;
  }, {});

  return { categories, projects, projectsBySlug };
};

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(null);
  const scrollRef = useRef(null);
  const [mediaSizes, setMediaSizes] = useState({});

  const portfolioAssets = import.meta.glob(
    '../assets/Portfolio/**',
    { eager: true, import: 'default' }
  );

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const project = portfolioIndex.projectsBySlug[slug] || portfolioIndex.projects[0];
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  useEffect(() => {
    setActiveGroupIndex(0);
  }, [project?.slug]);

  const isSmallMedia = (item) => {
    if (!item?.src || item.type !== 'image') return false;
    const size = mediaSizes[item.src];
    if (!size) return false;
    return size.width <= 900 && size.height <= 900;
  };

  const activeItems = project?.groups?.length
    ? project.groups[activeGroupIndex]?.items || []
    : project?.items || [];

  const slides = useMemo(() => {
    const result = [];
    const items = activeItems;

    for (let i = 0; i < items.length; i += 1) {
      const current = items[i];
      const next = items[i + 1];

      if (isSmallMedia(current) && isSmallMedia(next)) {
        result.push({ id: `${current.id}-${next.id}`, items: [current, next] });
        i += 1;
        continue;
      }

      result.push({ id: current.id, items: [current] });
    }

    return result;
  }, [activeItems, mediaSizes]);

  const slidesHeight = slides.length * 100;
  const resetScroll = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = 0;
  };

  const handleImageLoad = (src, event) => {
    const { naturalWidth, naturalHeight } = event.currentTarget;
    setMediaSizes((prev) => ({
      ...prev,
      [src]: { width: naturalWidth, height: naturalHeight },
    }));
  };

  useEffect(() => {
    resetScroll();
  }, [project?.slug, activeGroupIndex]);

  const renderMedia = (item) => {
    if (item.type === 'video') {
      return (
        <video
          src={item.src}
          className="max-h-full max-w-full object-contain"
          preload="metadata"
          controls
          playsInline
        />
      );
    }

    return (
      <img
        src={item.src}
        alt={item.alt}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
        onLoad={(event) => handleImageLoad(item.src, event)}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero Section - 2 Columnas Editorial */}
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[#B3262E] hover:text-[#B3262E]/80 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13 8H3m0 0l4 4m-4-4l4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>← Volver</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start lg:items-stretch lg:h-[calc(100vh-160px)] lg:overflow-hidden"
          >
            {/* Left Column - Sticky Full-Page Slides */}
            <div ref={scrollRef} className="relative lg:h-full lg:overflow-y-auto lg:pr-2">
              <div style={{ height: `${slidesHeight}vh` }}>
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    type="button"
                    className="sticky top-0 w-full h-[calc(100vh-160px)] rounded-2xl overflow-hidden border border-[#F0E6E8] shadow-2xl text-left"
                    onClick={() => setActiveImage(slide.items[0])}
                  >
                    {slide.items[0]?.src ? (
                      <div
                        className={`absolute inset-0 bg-white p-6 ${
                          slide.items.length > 1
                            ? 'grid grid-cols-1 md:grid-cols-2 gap-6 place-items-center'
                            : 'flex items-center justify-center'
                        }`}
                      >
                        {slide.items.map((item) => (
                          <div key={item.id} className="flex items-center justify-center h-full w-full">
                            {renderMedia(item)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${slide.items[0].gradient}`} />
                    )}
                    {!slide.items[0]?.src && <div className="absolute inset-0 bg-black/5" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Info Ficha */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white/5 rounded-2xl p-8 lg:p-10 border border-white/10 shadow-xl lg:h-[calc(100vh-160px)] lg:overflow-auto"
            >
              <p className="text-sm uppercase tracking-widest text-[#B3262E] mb-3">{project.categoryName}</p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight mb-4 text-white">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-white/65 leading-relaxed mb-8">
                  {project.description}
                </p>
              )}

              <div className="divide-y divide-[#F0E6E8] text-sm">
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[#B3262E] font-semibold">Cliente</span>
                  <span className="text-white font-medium">{project.client || project.title}</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[#B3262E] font-semibold">Año</span>
                  <span className="text-white font-medium">{project.year || '2025'}</span>
                </div>
                {project.groups?.length > 1 && (
                  <div className="py-3">
                    <span className="text-[#B3262E] font-semibold block mb-2">Colecciones</span>
                    <div className="flex flex-wrap gap-2">
                      {project.groups.map((group, index) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setActiveGroupIndex(index)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                            index === activeGroupIndex
                              ? 'bg-[#B3262E] text-white border-[#B3262E]'
                              : 'bg-[#FFF1F3] text-[#B3262E] border-[#F0E6E8]'
                          }`}
                        >
                          {group.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <a
                  href={project.externalLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <motion.button
                    whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(179, 38, 46, 0.25)' }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-lg text-sm tracking-wide uppercase shadow-lg transition-all"
                  >
                    Ver Proyecto
                  </motion.button>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[70vh] rounded-2xl overflow-hidden bg-white"
              onClick={(event) => event.stopPropagation()}
            >
              {activeImage.src ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white p-6">
                  {activeImage.type === 'video' ? (
                    <video
                      src={activeImage.src}
                      className="max-h-full max-w-full object-contain"
                      preload="metadata"
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${activeImage.gradient}`} />
              )}
              {!activeImage.src && <div className="absolute inset-0 bg-black/5" />}
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 text-[#1F1F1F] text-sm font-semibold"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Projects */}
      <section className="py-20 lg:py-32 bg-transparent border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-white"
            >
              Otros <span className="text-[#B3262E]">Proyectos</span>
            </motion.h2>
            <p className="text-lg text-white/65 max-w-2xl mx-auto">
              Explora más casos de éxito y cómo transformamos marcas en la industria
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioIndex.projects
              .filter((proj) => proj.slug !== project.slug)
              .slice(0, 3)
              .map((proj, index) => (
                <motion.div
                  key={proj.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/portfolio/${proj.slug}`}>
                    <div className="group relative h-[320px] lg:h-[360px] rounded-2xl overflow-hidden border border-white/10 hover:border-[#e73c50] transition-all duration-300 bg-white/5">
                      {proj.coverSrc ? (
                        <div className="absolute inset-0">
                          {isVideoSrc(proj.coverSrc) ? (
                            <video
                              src={proj.coverSrc}
                              className="h-full w-full object-cover"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          ) : (
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url("${proj.coverSrc}")` }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F6] to-[#FFFFFF]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 shadow-sm flex items-center justify-center">
                              <span className="text-xl font-display font-bold text-[#B3262E]">
                                {proj.title?.charAt(0) || 'P'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/45 transition-all duration-300" />

                      <div className="absolute inset-0 flex items-end p-6">
                        <div className="translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <p className="text-xs uppercase tracking-widest text-white/80 mb-2">{proj.categoryName}</p>
                          <h3 className="text-2xl font-display font-bold text-white">
                            {proj.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Now After Related Projects */}
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-white">
              ¿Te gustaría lograr <span className="text-[#e73c50]">resultados similares</span>?
            </h2>
            <p className="text-lg text-white/65 mb-10 leading-relaxed">
              Nuestro equipo está listo para transformar tu negocio. Contáctanos para explorar cómo podemos ayudarte a alcanzar tus objetivos.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(179, 38, 46, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-4 bg-[#B3262E] text-white font-bold rounded-lg text-lg shadow-md transition-all duration-300 inline-block"
              >
                Iniciar Proyecto
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PortfolioDetail;


