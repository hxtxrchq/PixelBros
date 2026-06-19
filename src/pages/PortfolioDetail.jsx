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
  return src.replace('/video/upload/', `/video/upload/f_auto,q_auto:eco,w_${width},c_limit/`);
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
        title: slug === 'fotografia-doctora-yuriko' ? 'Dra. Yuriko Cruz' : projectName,
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
        name: subprojectName || 'Galería',
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
        title: item.title || item.companyName || projectName,
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
          name: 'Galería',
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
          name: subprojectName || 'Galería',
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
      className={`group relative w-full h-full overflow-hidden bg-[#12142b] !rounded-none ${className}`}
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

const ImagePeekCarousel = ({ items, onOpen }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!items || items.length === 0) return null;

  const N = items.length;

  const handlePrev = () => {
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setActiveIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (N <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [N, activeIndex]);

  const slots = [-2, -1, 0, 1, 2];

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const activeW = isMobile ? 220 : (isTablet ? 300 : 380);
  const activeH = isMobile ? 310 : (isTablet ? 420 : 540);
  const inactiveW = isMobile ? 120 : (isTablet ? 170 : 220);
  const inactiveH = inactiveW; 
  const gap = isMobile ? 8 : (isTablet ? 14 : 16); // Reduced separation by 30%

  const offsetLeft1 = -activeW / 2 - gap - inactiveW / 2;
  const offsetRight1 = activeW / 2 + gap + inactiveW / 2;
  const offsetLeft2 = offsetLeft1 - gap - inactiveW;
  const offsetRight2 = offsetRight1 + gap + inactiveW;

  return (
    <div className="relative w-full max-w-[1100px] mx-auto py-12 overflow-hidden select-none">
      {/* Carousel Window */}
      <div className="relative flex items-center justify-center h-[340px] sm:h-[480px] md:h-[600px] w-full">
        {slots.map((slot) => {
          const itemIndex = (activeIndex + slot + N * 1000) % N;
          const item = items[itemIndex];
          if (!item) return null;

          const isCenter = slot === 0;
          const isLeft1 = slot === -1;
          const isRight1 = slot === 1;
          const isLeft2 = slot === -2;
          const isRight2 = slot === 2;

          let x = 0;
          let width = activeW;
          let height = activeH;
          let opacity = 1;
          let zIndex = 10;
          let yOffset = 0;
          let scale = 1;

          const isEven = Math.abs(activeIndex) % 2 === 0;
          const edgeOffset = (activeH - inactiveH) / 2;

          if (isCenter) {
            x = 0;
            yOffset = 0;
            width = activeW;
            height = activeH;
            opacity = 1;
            zIndex = 30;
            scale = 1;
          } else if (isLeft1) {
            x = offsetLeft1;
            yOffset = isEven ? edgeOffset : -edgeOffset;
            width = inactiveW;
            height = inactiveH;
            opacity = 0.5;
            zIndex = 20;
            scale = 1;
          } else if (isRight1) {
            x = offsetRight1;
            yOffset = isEven ? -edgeOffset : edgeOffset;
            width = inactiveW;
            height = inactiveH;
            opacity = 0.5;
            zIndex = 20;
            scale = 1;
          } else if (isLeft2) {
            x = offsetLeft2;
            yOffset = isEven ? -edgeOffset : edgeOffset;
            width = inactiveW;
            height = inactiveH;
            opacity = 0;
            zIndex = 10;
            scale = 0;
          } else if (isRight2) {
            x = offsetRight2;
            yOffset = isEven ? edgeOffset : -edgeOffset;
            width = inactiveW;
            height = inactiveH;
            opacity = 0;
            zIndex = 10;
            scale = 0;
          }

          const uniqueKey = N < 5 ? `${item.id}-${slot}` : item.id;

          return (
            <motion.div
              key={uniqueKey}
              style={{ zIndex }}
              animate={{
                x,
                y: yOffset,
                width,
                height,
                opacity,
                scale,
              }}
              transition={{ type: 'spring', stiffness: 220, damping: 25 }}
              onClick={() => {
                if (isCenter) {
                  onOpen(item);
                } else {
                  setActiveIndex((prev) => prev + slot);
                }
              }}
              className="absolute bg-[#12142b] border border-white/10 rounded-none overflow-hidden group shadow-2xl cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 pointer-events-none z-40">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="p-3 bg-black/60 hover:bg-black/85 text-white rounded-full transition-all border border-white/10 pointer-events-auto shadow-lg"
            aria-label="Anterior"
          >
            <svg className="w-5 h-5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="p-3 bg-black/60 hover:bg-black/85 text-white rounded-full transition-all border border-white/10 pointer-events-auto shadow-lg"
            aria-label="Siguiente"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const VideoStackDeck = ({ items, onOpen }) => {
  const [stack, setStack] = useState(items);

  useEffect(() => {
    setStack(items);
  }, [items]);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setStack((prev) => {
      if (prev.length <= 1) return prev;
      const [top, ...rest] = prev;
      return [...rest, top];
    });
  };

  useEffect(() => {
    if (stack.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3000);
    return () => clearInterval(interval);
  }, [stack]);

  return (
    <div className="relative w-full max-w-[640px] mx-auto py-12 px-4 flex flex-col items-center">
      <div 
        className="relative w-full aspect-[16/10] sm:aspect-[16/9]"
        onClick={() => handleNext()}
      >
        <AnimatePresence mode="popLayout">
          {stack.slice(0, 4).reverse().map((item, index, arr) => {
            const position = arr.length - 1 - index;
            const isFront = position === 0;
            const scale = 1 - position * 0.08;
            const yOffset = -position * 40;
            const zIndex = 50 - position;

            return (
              <motion.div
                key={item.id}
                style={{
                  zIndex,
                  transformOrigin: 'top center',
                }}
                layout
                initial={isFront ? { opacity: 0, scale: 0.85, y: -40 } : false}
                animate={{
                  y: yOffset,
                  scale,
                  opacity: 1,
                }}
                exit={isFront ? { y: 280, opacity: 0, scale: 0.85, transition: { duration: 0.35 } } : { opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                drag={isFront && stack.length > 1 ? 'y' : false}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.6}
                onDragEnd={(e, info) => {
                  if (info.offset.y > 80 || info.offset.y < -80) {
                    handleNext();
                  }
                }}
                className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
              >
                <div className="w-full h-full bg-[#12142b] border border-white/10 rounded-none overflow-hidden group shadow-2xl relative">
                  
                  {isFront ? (
                    <video
                      src={item.src}
                      className="w-full h-full object-cover"
                      controls={false}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={item.previewSrc}
                      alt={item.alt}
                      className="w-full h-full object-cover pointer-events-none select-none"
                    />
                  )}
                  
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpen(item);
                    }}
                    className="absolute inset-0 bg-transparent hover:bg-black/10 transition-colors flex items-center justify-center cursor-pointer z-20"
                  >
                    {isFront && (
                      <div className="p-4 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const BrandingTile = ({ item, onOpen }) => {
  const previewSrc = item.previewSrc || (item.type === 'video' ? derivePoster(item.src, 620) : optimizeImageSrc(item.src, 620));

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="group relative block w-full overflow-hidden text-left !rounded-none"
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
  const [activeMedia, setActiveMedia] = useState(null);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
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

  // Merge all groups into a single flat list, ordered by group then by item order
  const allItems = useMemo(() => {
    if (!project?.groups) return [];
    return project.groups.flatMap((group) => group.items);
  }, [project?.groups]);

  const { videos, images } = useMemo(() => {
    const v = [];
    const img = [];
    for (const item of allItems) {
      if (item.type === 'video') {
        v.push(item);
      } else {
        img.push(item);
      }
    }
    return { videos: v, images: img };
  }, [allItems]);

  useEffect(() => {
    setActiveMedia(null);
  }, [project?.slug]);

  useEffect(() => {
    if (activeMedia) {
      setIsMediaLoading(true);
    }
  }, [activeMedia]);

  const visibleItems = allItems;
  const isBranding = isBrandingCategory(project);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
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
              className="inline-flex items-center gap-2 text-white hover:text-[#e73c50] transition-colors font-medium text-sm uppercase tracking-wide"
            >
              <svg
                className="w-4 h-4 rotate-180"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span>Volver</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
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
              {allItems.length} elemento{allItems.length === 1 ? '' : 's'}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
          {isBranding ? (
            <BrandingComposition items={visibleItems} onOpen={setActiveMedia} />
          ) : (
            <>
              {videos.length > 0 && (
                <div className="flex flex-col items-center">
                  {images.length > 0 && (
                    <h3 className="text-lg font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
                      Videos del proyecto
                    </h3>
                  )}
                  <VideoStackDeck items={videos} onOpen={setActiveMedia} />
                </div>
              )}
              
              {images.length > 0 && (
                <div className="flex flex-col items-center w-full">
                  {videos.length > 0 && (
                    <h3 className="text-lg font-bold text-white/40 uppercase tracking-[0.2em] mb-6">
                      Galería de imágenes
                    </h3>
                  )}
                  <ImagePeekCarousel items={images} onOpen={setActiveMedia} />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      </motion.div>

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

                 <div className="p-4 sm:p-6 flex items-center justify-center max-h-[92vh] relative min-h-[220px]">
                   {isMediaLoading && (
                     <div className="absolute inset-0 flex items-center justify-center bg-[#0b0d22] z-20">
                       <div className="w-10 h-10 border-4 border-[#e73c50] border-t-transparent rounded-full animate-spin" />
                     </div>
                   )}
                   {activeMedia.type === 'video' ? (
                     <video
                       src={optimizeVideoSrc(activeMedia.src, 1280)}
                       className="max-h-[84vh] max-w-full object-contain"
                       controls
                       preload="metadata"
                       playsInline
                       onLoadedData={() => setIsMediaLoading(false)}
                       onError={() => setIsMediaLoading(false)}
                     />
                   ) : (
                     <img
                       src={optimizeImageSrc(activeMedia.src, 1700)}
                       alt={activeMedia.alt}
                       className="max-h-[84vh] max-w-full object-contain"
                       onLoad={() => setIsMediaLoading(false)}
                       onError={() => setIsMediaLoading(false)}
                     />
                   )}
                 </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PortfolioDetail;


