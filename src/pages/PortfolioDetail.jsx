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
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

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
    setActiveSlideIndex(0);
  }, [project?.slug]);

  useEffect(() => {
    setActiveSlideIndex(0);
  }, [activeGroupIndex]);

  const activeItems = project?.groups?.length
    ? project.groups[activeGroupIndex]?.items || []
    : project?.items || [];

  const goTo = (index) => {
    setSlideDir(index > activeSlideIndex ? 1 : -1);
    setActiveSlideIndex(index);
  };
  const prev = () => goTo((activeSlideIndex - 1 + activeItems.length) % activeItems.length);
  const next = () => goTo((activeSlideIndex + 1) % activeItems.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') {
        setSlideDir(1);
        setActiveSlideIndex((i) => (i + 1) % activeItems.length);
      } else if (e.key === 'ArrowLeft') {
        setSlideDir(-1);
        setActiveSlideIndex((i) => (i - 1 + activeItems.length) % activeItems.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeItems.length]);

  const dragMovedRef = useRef(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0, side: null, visible: false });
  const slideAreaRef = useRef(null);

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
              className="inline-flex items-center gap-2 text-[#e73c50] hover:text-[#e73c50]/70 transition-colors font-medium text-sm uppercase tracking-wide"
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
            className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start"
          >
            {/* Left Column — Full-bleed drag slider */}
            <div className="relative" style={{ minHeight: 520 }}>
              <div
                ref={slideAreaRef}
                className="relative rounded-2xl overflow-hidden bg-[#0d0e24] lg:sticky lg:top-24"
                style={{
                  height: 'clamp(420px, 65vh, 720px)',
                  boxShadow: '0 40px 80px rgba(5,6,26,0.7)',
                  cursor: activeItems.length > 1 ? 'none' : 'zoom-in',
                }}
                onMouseMove={(e) => {
                  const rect = slideAreaRef.current?.getBoundingClientRect();
                  if (!rect) return;
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setCursor({ x, y, side: x < rect.width / 2 ? 'left' : 'right', visible: true });
                }}
                onMouseLeave={() => setCursor((c) => ({ ...c, visible: false }))}
              >
                {/* Custom cursor circle */}
                <AnimatePresence>
                  {cursor.visible && activeItems.length > 1 && (
                    <motion.div
                      className="absolute z-30 pointer-events-none"
                      style={{ left: cursor.x, top: cursor.y, translateX: '-50%', translateY: '-50%' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center" style={{ background: 'rgba(231,60,80,0.18)', backdropFilter: 'blur(4px)' }}>
                        <span className="text-white font-bold text-sm leading-none select-none">
                          {cursor.side === 'left' ? '←' : '→'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Slides */}
                <AnimatePresence mode="wait" custom={slideDir}>
                  {activeItems[activeSlideIndex] && (
                    <motion.div
                      key={activeSlideIndex}
                      custom={slideDir}
                      variants={{
                        enter: (d) => ({ x: d * 60, opacity: 0, filter: 'blur(6px)' }),
                        center: { x: 0, opacity: 1, filter: 'blur(0px)' },
                        exit: (d) => ({ x: d * -60, opacity: 0, filter: 'blur(6px)' }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      drag={activeItems.length > 1 ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.15}
                      onDragStart={() => { dragMovedRef.current = false; }}
                      onDrag={(_, info) => { if (Math.abs(info.offset.x) > 8) dragMovedRef.current = true; }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -50) next();
                        else if (info.offset.x > 50) prev();
                      }}
                      onClick={() => { if (!dragMovedRef.current) setActiveImage(activeItems[activeSlideIndex]); }}
                      className="absolute inset-0 flex items-center justify-center select-none"
                      style={{ cursor: activeItems.length > 1 ? 'grab' : 'zoom-in' }}
                      whileDrag={{ cursor: 'grabbing', scale: 0.98 }}
                    >
                      {activeItems[activeSlideIndex].type === 'video' ? (
                        <video
                          src={activeItems[activeSlideIndex].src}
                          className="max-h-full max-w-full object-contain"
                          preload="metadata"
                          controls
                          playsInline
                          onClick={(e) => e.stopPropagation()}
                          style={{ maxHeight: '100%', maxWidth: '100%', padding: '2rem' }}
                        />
                      ) : (
                        <img
                          src={activeItems[activeSlideIndex].src}
                          alt={activeItems[activeSlideIndex].alt}
                          draggable={false}
                          className="max-h-full max-w-full object-contain"
                          style={{ padding: '2rem', userSelect: 'none' }}
                          loading="lazy"
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Click zones — use custom cursor for direction hint */}
                {activeItems.length > 1 && (
                  <>
                    <button type="button" aria-label="Anterior"
                      onClick={(e) => { e.stopPropagation(); prev(); }}
                      className="absolute left-0 top-0 bottom-10 w-1/2 z-20"
                      style={{ cursor: 'none', background: 'none', border: 'none' }}
                    />
                    <button type="button" aria-label="Siguiente"
                      onClick={(e) => { e.stopPropagation(); next(); }}
                      className="absolute right-0 top-0 bottom-10 w-1/2 z-20"
                      style={{ cursor: 'none', background: 'none', border: 'none' }}
                    />
                  </>
                )}

                {/* Ghost slide number — big watermark bottom-left */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlideIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-2 left-5 z-10 pointer-events-none select-none leading-none font-black text-white"
                    style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', opacity: 0.08, letterSpacing: '-0.04em' }}
                  >
                    {String(activeSlideIndex + 1).padStart(2, '0')}
                  </motion.div>
                </AnimatePresence>

                {/* Bottom bar — dots/progress only */}
                {activeItems.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-4 flex items-center justify-end">
                    {activeItems.length <= 8 ? (
                      <div className="flex items-center gap-1.5">
                        {activeItems.map((_, i) => (
                          <motion.button
                            key={i}
                            type="button"
                            onClick={() => goTo(i)}
                            animate={{
                              width: i === activeSlideIndex ? 20 : 4,
                              opacity: i === activeSlideIndex ? 1 : 0.25,
                              backgroundColor: i === activeSlideIndex ? '#e73c50' : '#ffffff',
                            }}
                            transition={{ duration: 0.3 }}
                            className="h-[3px] rounded-full"
                            style={{ minWidth: 4 }}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="w-32 h-[2px] rounded-full bg-white/15 overflow-hidden">
                        <motion.div
                          className="h-full bg-[#e73c50] rounded-full"
                          animate={{ width: `${((activeSlideIndex + 1) / activeItems.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Info Ficha */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-[#0d0e24] rounded-2xl p-8 lg:p-10 shadow-xl lg:sticky lg:top-24"
            >
              <p className="text-sm uppercase tracking-widest text-[#e73c50] mb-3">{project.categoryName}</p>
              <h1 className="text-3xl lg:text-4xl font-display font-bold tracking-tight mb-4 text-white">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-white/65 leading-relaxed mb-8">
                  {project.description}
                </p>
              )}

              <div className="divide-y divide-white/10 text-sm">
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[#e73c50] font-semibold">Cliente</span>
                  <span className="text-white font-medium">{project.client || project.title}</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-[#e73c50] font-semibold">Año</span>
                  <span className="text-white font-medium">{project.year || '2025'}</span>
                </div>
                {project.groups?.length > 1 && (
                  <div className="py-3">
                    <span className="text-[#e73c50] font-semibold block mb-2">Colecciones</span>
                    <div className="flex flex-wrap gap-2">
                      {project.groups.map((group, index) => (
                        <button
                          key={group.id}
                          type="button"
                          onClick={() => setActiveGroupIndex(index)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            index === activeGroupIndex
                              ? 'bg-[#e73c50] text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/15'
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
                    className="px-8 py-4 bg-[#e73c50] text-white font-bold rounded-full text-sm tracking-wide uppercase shadow-lg transition-all"
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
              className="relative w-full max-w-5xl h-[70vh] rounded-2xl overflow-hidden bg-[#0d0e24]"
              onClick={(event) => event.stopPropagation()}
            >
              {activeImage.src ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d0e24] p-6">
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
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
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
              Otros <span className="text-[#e73c50]">Proyectos</span>
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
                    <div className="group relative h-[320px] lg:h-[360px] rounded-2xl overflow-hidden transition-all duration-300 bg-[#0d0e24]">
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
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c52] to-[#0d0e24]">
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
                className="px-12 py-4 bg-[#e73c50] text-white font-bold rounded-full text-lg shadow-md transition-all duration-300 inline-block"
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


