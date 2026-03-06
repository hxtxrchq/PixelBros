import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';

const INITIAL_VISIBLE = 18;
const LOAD_STEP = 18;

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

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

const derivePoster = (src) => {
  if (!src || !isVideoSrc(src)) return src;
  return src
    .replace('/video/upload/', '/video/upload/so_0,q_auto,f_jpg/')
    .replace(/\.(mp4|webm)$/i, '.jpg');
};

const buildPortfolioIndex = (assets) => {
  const categoriesMap = new Map();

  Object.entries(assets).forEach(([rawPath, src]) => {
    const path = rawPath.replace(/\\/g, '/');
    const match = path.match(/\/Portfolio\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!match) return;

    const [, categoryName, projectName, rest] = match;
    const categorySlug = slugify(categoryName);
    const projectSlug = slugify(projectName);

    // Excluir fuente duplicada en fotografia.
    if (categorySlug === 'fotografia' && projectSlug === 'doctores') return;

    const restParts = rest.split('/');
    const fileName = restParts[restParts.length - 1];
    const subprojectName = restParts.length > 1 ? restParts[0] : null;

    const extMatch = fileName.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const type = ['mp4', 'webm'].includes(ext) ? 'video' : 'image';

    const order = getFileOrder(fileName);
    const nameKey = fileName.toLowerCase();

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
        id: groupKey,
        name: subprojectName || 'Galeria',
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
              items: group.items.sort((a, b) => a.order - b.order || a.nameKey.localeCompare(b.nameKey)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const cover = groups[0]?.items?.[0] || null;

          return {
            ...project,
            groups,
            totalItems: groups.reduce((acc, group) => acc + group.items.length, 0),
            coverSrc: cover?.src || null,
            coverType: cover?.type || null,
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

const ProjectMediaTile = ({ item, onOpen, branding = false }) => {
  const previewSrc = item.type === 'video' ? derivePoster(item.src) : item.src;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`group relative block w-full overflow-hidden border border-white/10 bg-[#0f122d] text-left ${branding ? 'mb-3' : 'mb-4'}`}
      style={{ breakInside: 'avoid' }}
    >
      {previewSrc && (
        <img
          src={previewSrc}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.015]"
        />
      )}

      {item.type === 'video' && (
        <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] uppercase tracking-[0.15em] bg-black/65 text-white/85">
          Video
        </span>
      )}
    </button>
  );
};

const BRANDING_ROW_PATTERN = [
  [1],
  [1],
  [0.5, 0.5],
  [0.5, 0.5],
  [1],
  [1],
  [1],
  [0.5, 0.5],
  [0.5, 0.5],
  [1],
  [1],
];

const BrandingTile = ({ item, onOpen }) => {
  const previewSrc = item.type === 'video' ? derivePoster(item.src) : item.src;

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative block w-full overflow-hidden text-left"
    >
      {previewSrc && (
        <img
          src={previewSrc}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.01]"
        />
      )}

      {item.type === 'video' && (
        <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] uppercase tracking-[0.15em] bg-black/65 text-white/85">
          Video
        </span>
      )}
    </button>
  );
};

const BrandingComposition = ({ items, onOpen }) => {
  const rows = [];
  let cursor = 0;

  for (let i = 0; i < BRANDING_ROW_PATTERN.length && cursor < items.length; i += 1) {
    const rowPattern = BRANDING_ROW_PATTERN[i];
    const rowItems = items.slice(cursor, cursor + rowPattern.length);
    rows.push({ rowPattern, rowItems, key: `row-${i}` });
    cursor += rowPattern.length;
  }

  if (cursor < items.length) {
    const leftovers = items.slice(cursor);
    leftovers.forEach((item, index) => {
      rows.push({ rowPattern: [1], rowItems: [item], key: `leftover-${index}` });
    });
  }

  return (
    <div className="w-full max-w-[740px] sm:max-w-[820px] lg:max-w-[640px] xl:max-w-[700px] mx-auto">
      <div className="flex flex-col gap-3 sm:gap-4">
        {rows.map((row) => (
          <div key={row.key} className="flex gap-3 sm:gap-4">
            {row.rowItems.map((item, idx) => {
              const ratio = row.rowPattern[idx] ?? 1;
              const widthClass = ratio === 1 ? 'basis-full' : 'basis-1/2';
              return (
                <div key={item.id} className={widthClass}>
                  <BrandingTile item={item} onOpen={onOpen} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [activeMedia, setActiveMedia] = useState(null);

  const portfolioAssets = getPortfolioAssets();

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const project = portfolioIndex.projectsBySlug[slug] || portfolioIndex.projects[0];

  useEffect(() => {
    setActiveGroupIndex(0);
    setVisibleCount(INITIAL_VISIBLE);
    setActiveMedia(null);
  }, [project?.slug]);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeGroupIndex]);

  const activeGroup = project?.groups?.[activeGroupIndex] || null;
  const activeItems = activeGroup?.items || [];
  const visibleItems = activeItems.slice(0, visibleCount);

  const canLoadMore = visibleCount < activeItems.length;
  const isBranding = project?.categoryId === 'diseno-de-identidad-visual';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      <section className="pt-24 pb-10 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mb-10"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[#e73c50] hover:text-[#e73c50]/75 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              <span>Volver al portfolio</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-5"
          >
            <p className="text-xs uppercase tracking-[0.24em] text-[#e73c50]">
              {project?.categoryName}
            </p>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white leading-[0.95]">
              {project?.title}
            </h1>
            <p className="text-white/65 text-sm uppercase tracking-[0.16em]">
              {activeItems.length} elemento{activeItems.length === 1 ? '' : 's'}
            </p>
          </motion.div>

          {project?.groups?.length > 1 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {project.groups.map((group, index) => (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupIndex(index)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] border transition-colors ${
                    index === activeGroupIndex
                      ? 'border-[#e73c50] bg-[#e73c50] text-white'
                      : 'border-white/15 text-white/70 hover:border-white/35'
                  }`}
                >
                  {group.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isBranding ? (
            <BrandingComposition items={visibleItems} onOpen={setActiveMedia} />
          ) : (
            <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
              {visibleItems.map((item) => (
                <ProjectMediaTile
                  key={item.id}
                  item={item}
                  onOpen={setActiveMedia}
                />
              ))}
            </div>
          )}

          {canLoadMore && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + LOAD_STEP)}
                className="px-8 py-3 bg-[#e73c50] text-white font-semibold hover:bg-[#ef4b63] transition-colors"
              >
                Cargar mas
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
            Otros <span className="text-[#e73c50]">proyectos</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {portfolioIndex.projects
              .filter((entry) => entry.slug !== project?.slug)
              .slice(0, 3)
              .map((entry) => {
                const cover = entry.coverType === 'video' ? derivePoster(entry.coverSrc) : entry.coverSrc;
                return (
                  <Link key={entry.slug} to={`/portfolio/${entry.slug}`}>
                    <article className="border border-white/10 bg-[#0c0e24] hover:border-[#e73c50]/60 transition-colors h-full">
                      <div className="aspect-[4/3] overflow-hidden bg-[#131632]">
                        {cover && (
                          <img
                            src={cover}
                            alt={entry.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-[#e73c50] mb-2">{entry.categoryName}</p>
                        <h3 className="text-white text-xl font-display font-bold">{entry.title}</h3>
                      </div>
                    </article>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 p-4 sm:p-6"
            onClick={() => setActiveMedia(null)}
          >
            <div className="h-full w-full flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-6xl max-h-[92vh] bg-[#0b0d22] border border-white/10"
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="absolute top-3 right-3 z-10 px-3 py-1 bg-black/60 text-white text-xs uppercase tracking-[0.14em]"
                >
                  Cerrar
                </button>

                <div className="p-4 sm:p-6 flex items-center justify-center max-h-[92vh]">
                  {activeMedia.type === 'video' ? (
                    <video
                      src={activeMedia.src}
                      className="max-h-[84vh] max-w-full object-contain"
                      controls
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.alt}
                      className="max-h-[84vh] max-w-full object-contain"
                    />
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PortfolioDetail;


