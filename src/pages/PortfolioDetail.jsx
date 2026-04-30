import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';
import { listPublicContent } from '../services/publicContentClient';

const normalizeName = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const slugify = (value) => normalizeName(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const isBrandingCategory = (project) => {
  const id = project?.categoryId || '';
  const name = slugify(project?.categoryName || '');
  return id === 'diseno-de-identidad-visual' || id === 'branding' || name.includes('identidad-visual') || name.includes('branding');
};

const getFileOrder = (fileName) => {
  const match = fileName.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

const optimizeImageSrc = (src, width = 800) => {
  if (!src || !src.includes('/image/upload/')) return src;
  return src.replace('/image/upload/', `/image/upload/f_auto,q_auto:eco,w_${width},c_limit/`);
};

const optimizeVideoSrc = (src, width = 1280) => {
  if (!src || !src.includes('/video/upload/')) return src;
  return src.replace('/video/upload/', `/video/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const derivePoster = (src, width = 800) => {
  if (!src || !isVideoSrc(src)) return src;
  return src
    .replace('/video/upload/', `/video/upload/so_0,f_jpg,q_auto:eco,w_${width},c_limit/`)
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
    const previewSrc = type === 'video' ? derivePoster(src, 540) : optimizeImageSrc(src, 540);

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
      previewSrc,
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

const parseMediaPartsFromUrl = (src) => {
  if (typeof src !== 'string') return null;

  try {
    const parsed = new URL(src);
    const pathname = decodeURIComponent(parsed.pathname);
    const marker = '/Portfolio/';
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex === -1) return null;

    const relative = pathname.slice(markerIndex + 1);
    const segments = relative.split('/').filter(Boolean);
    if (segments.length < 4 || segments[0] !== 'Portfolio') return null;

    return {
      categoryName: segments[1].replace(/_/g, ' ').trim(),
      projectName: segments[2].replace(/_/g, ' ').trim(),
      restSegments: segments.slice(3),
    };
  } catch {
    return null;
  }
};

const buildPortfolioIndexFromApi = (items) => {
  const categoriesMap = new Map();

  for (const item of items) {
    const fallbackCategory = (item.category || 'General').trim();
    const fallbackProject = (item.title || item.companyName || 'Proyecto').trim();

    const urlForParsing = item.coverUrl || item.medias?.[0]?.url || null;
    const parsed = parseMediaPartsFromUrl(urlForParsing);

    const categoryName = parsed?.categoryName || fallbackCategory;
    const projectName = parsed?.projectName || fallbackProject;
    const categorySlug = slugify(categoryName);
    const projectSlug = slugify(projectName);
    const slug = item.slug || `${categorySlug}-${projectSlug}`;

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
    const gallery = item.medias ?? [];

    if (gallery.length === 0 && item.coverUrl) {
      const coverExt = item.coverUrl.match(/\.([^.?#/]+)(?:[?#]|$)/i)?.[1]?.toLowerCase() ?? '';
      const coverType = ['mp4', 'webm'].includes(coverExt) ? 'video' : 'image';
      const defaultGroupKey = 'default';
      if (!project.groups.has(defaultGroupKey)) {
        project.groups.set(defaultGroupKey, {
          id: defaultGroupKey,
          name: 'Galeria',
          items: [],
        });
      }

      project.groups.get(defaultGroupKey).items.push({
        id: `${slug}-${defaultGroupKey}-cover`,
        src: item.coverUrl,
        previewSrc: coverType === 'video' ? derivePoster(item.coverUrl, 540) : optimizeImageSrc(item.coverUrl, 540),
        type: coverType,
        order: 0,
        nameKey: 'cover',
        alt: `${projectName} portada`,
      });
    }

    for (const media of gallery) {
      const parsedMedia = parseMediaPartsFromUrl(media.url);
      const restSegments = parsedMedia?.restSegments ?? [];
      const fileName = restSegments[restSegments.length - 1] || media.url.split('/').pop() || '';
      const subprojectName = restSegments.length > 1 ? restSegments[0].replace(/_/g, ' ').trim() : null;

      const extMatch = fileName.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';
      const type = ['mp4', 'webm'].includes(ext) ? 'video' : 'image';
      const previewSrc = type === 'video' ? derivePoster(media.url, 540) : optimizeImageSrc(media.url, 540);
      const orderFromName = getFileOrder(fileName);
      const order = Number.isFinite(orderFromName) ? orderFromName : (media.sortOrder ?? 0);
      const nameKey = fileName.toLowerCase();
      const groupKey = subprojectName ? slugify(subprojectName) : 'default';

      if (!project.groups.has(groupKey)) {
        project.groups.set(groupKey, {
          id: groupKey,
          name: subprojectName || 'Galeria',
          items: [],
        });
      }

      project.groups.get(groupKey).items.push({
        id: media.id,
        src: media.url,
        previewSrc,
        type,
        order,
        nameKey,
        alt: `${projectName} ${fileName}`,
      });
    }
  }

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

const buildBalancedBlocks = (items) => {
  const blocks = [];
  for (let i = 0; i < items.length; i += 5) blocks.push(items.slice(i, i + 5));

  // Avoid a final lonely row (e.g., 6+1) by borrowing from previous blocks.
  while (blocks.length > 1) {
    const last = blocks[blocks.length - 1];
    if (last.length >= 3) break;

    const prev = blocks[blocks.length - 2];
    if (!prev || prev.length <= 3) break;

    last.unshift(prev.pop());
  }

  return blocks;
};

const ReferenceMediaTile = ({ item, onOpen, className = '', width = 620, fit = 'cover' }) => {
  if (!item) return <div className={`bg-[#dcdad3]/60 ${className}`} />;

  const previewSrc = item.previewSrc || (item.type === 'video' ? derivePoster(item.src, width) : optimizeImageSrc(item.src, width));

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className={`group relative w-full h-full overflow-hidden bg-[#12142b] ${className}`}
    >
      {previewSrc && (
        <img
          src={previewSrc}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          className={`h-full w-full ${fit === 'cover' ? 'object-cover' : 'object-contain p-1 sm:p-1.5'} transition-transform duration-500 group-hover:scale-[1.01]`}
        />
      )}

      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/28 transition-colors duration-300" />

      {item.type === 'video' && (
        <span className="absolute bottom-2 right-2 px-2 py-1 text-[10px] uppercase tracking-[0.15em] bg-black/70 text-white/90">
          Video
        </span>
      )}
    </button>
  );
};

const ReferenceComposition = ({ items, onOpen }) => {
  const blocks = buildBalancedBlocks(items);

  return (
    <div className="w-full max-w-[920px] lg:max-w-[980px] mx-auto flex flex-col gap-4 sm:gap-6">
      {blocks.map((block, blockIndex) => {
        if (block.length === 1) {
          return (
            <div
              key={`ref-single-${blockIndex}`}
              className="max-w-[760px] mx-auto w-full border border-white/10 bg-[#f1efe8] p-2 sm:p-3"
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#12142b]">
                <ReferenceMediaTile item={block[0]} onOpen={onOpen} width={980} fit="cover" className="h-full" />
              </div>
            </div>
          );
        }

        if (block.length === 2) {
          return (
            <div
              key={`ref-double-${blockIndex}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 border border-white/10 bg-[#f1efe8] p-2 sm:p-3"
            >
              {block.map((item) => (
                <div key={item.id} className="aspect-[4/3] overflow-hidden bg-[#12142b]">
                  <ReferenceMediaTile item={item} onOpen={onOpen} width={680} fit="cover" className="h-full" />
                </div>
              ))}
            </div>
          );
        }

        if (block.length === 3) {
          const featured = block[0];
          const rightTop = block[1];
          const rightBottom = block[2];

          return (
            <div
              key={`ref-triple-${blockIndex}`}
              className="grid grid-cols-[1.08fr_0.92fr] h-[300px] sm:h-[360px] lg:h-[420px] overflow-hidden border border-white/10 bg-[#0f122d]"
            >
              <div className="h-full min-h-0">
                <ReferenceMediaTile item={featured} onOpen={onOpen} width={980} fit="cover" className="h-full" />
              </div>

              <div className="h-full min-h-0 bg-[#f1efe8] p-2 sm:p-3 lg:p-4">
                <div className="grid h-full min-h-0 grid-rows-2 gap-2 sm:gap-2.5">
                  <ReferenceMediaTile item={rightTop} onOpen={onOpen} width={700} fit="cover" className="row-span-1" />
                  <ReferenceMediaTile item={rightBottom} onOpen={onOpen} width={700} fit="cover" className="row-span-1" />
                </div>
              </div>
            </div>
          );
        }

        if (block.length === 4) {
          const featured = block[0];
          const top = block[1];
          const leftBottom = block[2];
          const rightBottom = block[3];

          return (
            <div
              key={`ref-quad-${blockIndex}`}
              className="grid grid-cols-[1.05fr_0.95fr] h-[300px] sm:h-[360px] lg:h-[440px] overflow-hidden border border-white/10 bg-[#0f122d]"
            >
              <div className="h-full min-h-0">
                <ReferenceMediaTile item={featured} onOpen={onOpen} width={980} fit="cover" className="h-full" />
              </div>

              <div className="h-full min-h-0 bg-[#f1efe8] p-2 sm:p-3 lg:p-4">
                <div className="grid h-full min-h-0 grid-cols-2 grid-rows-[1.15fr_1fr] gap-2 sm:gap-2.5">
                  <ReferenceMediaTile item={top} onOpen={onOpen} width={700} fit="cover" className="col-span-2 row-span-1" />
                  <ReferenceMediaTile item={leftBottom} onOpen={onOpen} width={640} fit="cover" className="col-span-1 row-span-1" />
                  <ReferenceMediaTile item={rightBottom} onOpen={onOpen} width={640} fit="cover" className="col-span-1 row-span-1" />
                </div>
              </div>
            </div>
          );
        }

        const featured = block[0];
        const top = block[1];
        const center = block[2];
        const accent = block[3];
        const bottom = block[4];

        return (
          <div
            key={`ref-block-${blockIndex}`}
            className="grid grid-cols-[1.04fr_0.96fr] h-[320px] sm:h-[380px] lg:h-[460px] overflow-hidden border border-white/10 bg-[#0f122d]"
          >
            <div className="h-full min-h-0">
              <ReferenceMediaTile item={featured} onOpen={onOpen} width={980} fit="cover" className="h-full" />
            </div>

            <div className="h-full min-h-0 bg-[#f1efe8] p-2 sm:p-3 lg:p-4">
              <div className="grid h-full min-h-0 grid-cols-2 grid-rows-[1.2fr_1fr_1fr] gap-2 sm:gap-2.5">
                <ReferenceMediaTile item={top} onOpen={onOpen} width={620} fit="cover" className="col-span-2 row-span-1" />
                <ReferenceMediaTile item={center} onOpen={onOpen} width={620} fit="cover" className="col-span-1 row-span-1" />
                <ReferenceMediaTile item={accent} onOpen={onOpen} width={540} fit="cover" className="col-span-1 row-span-1" />
                <ReferenceMediaTile item={bottom} onOpen={onOpen} width={620} fit="cover" className="col-span-2 row-span-1" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const BrandingTile = ({ item, onOpen }) => {
  const previewSrc = item.previewSrc || (item.type === 'video' ? derivePoster(item.src, 620) : optimizeImageSrc(item.src, 620));

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
          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.01]"
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
  return (
    <div className="w-full max-w-[740px] sm:max-w-[820px] lg:max-w-[700px] xl:max-w-[760px] mx-auto columns-1 sm:columns-2 gap-3 sm:gap-4">
      {items.map((item) => (
        <div key={item.id} className="mb-3 sm:mb-4" style={{ breakInside: 'avoid' }}>
          <BrandingTile item={item} onOpen={onOpen} />
        </div>
      ))}
      </div>
  );
};

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [activeMedia, setActiveMedia] = useState(null);
  const [apiIndex, setApiIndex] = useState(null);

  const portfolioAssets = getPortfolioAssets();

  const localIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const portfolioIndex = apiIndex ?? localIndex;

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      try {
        const items = await listPublicContent();
        if (!isMounted || items.length === 0) return;
        setApiIndex(buildPortfolioIndexFromApi(items));
      } catch {
        if (!isMounted) return;
        setApiIndex(null);
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, []);

  const project = portfolioIndex.projectsBySlug[slug] || portfolioIndex.projects[0];
  const activeGroup = project?.groups?.[activeGroupIndex] || null;
  const activeItems = activeGroup?.items || [];

  useEffect(() => {
    setActiveGroupIndex(0);
    setActiveMedia(null);
  }, [project?.slug]);

  const visibleItems = activeItems;
  const isBranding = isBrandingCategory(project);

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
            <ReferenceComposition items={visibleItems} onOpen={setActiveMedia} />
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
                const coverSrc = entry.coverType === 'video' ? derivePoster(entry.coverSrc, 700) : optimizeImageSrc(entry.coverSrc, 700);
                return (
                  <Link key={entry.slug} to={`/portfolio/${entry.slug}`}>
                    <article className="border border-white/10 bg-[#0c0e24] hover:border-[#e73c50]/60 transition-colors h-full">
                      <div className="aspect-[4/3] overflow-hidden bg-[#131632]">
                        {coverSrc && (
                          <img
                            src={coverSrc}
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
                      src={optimizeVideoSrc(activeMedia.src, 1280)}
                      className="max-h-[84vh] max-w-full object-contain"
                      controls
                      preload="metadata"
                      playsInline
                    />
                  ) : (
                    <img
                      src={optimizeImageSrc(activeMedia.src, 1700)}
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


