import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';
import { listPublicContent } from '../services/publicContentClient';

const CATEGORY_ORDER = [
  'social-media',
  'audiovisual',
  'fotografia',
  'diseno-de-identidad-visual',
  'menu-digital',
];

const CATEGORY_DISPLAY = {
  'diseno-de-identidad-visual': 'Branding',
  'social-media': 'Social Media',
  audiovisual: 'Audiovisual',
  fotografia: 'Fotografía',
  'menu-digital': 'Menú digital',
};

const SOCIAL_RUBROS = [
  { id: 'horeca', label: 'HORECA' },
  { id: 'salud', label: 'Salud' },
  { id: 'construccion-inmobiliaria', label: 'Construcción e inmobiliaria' },
  { id: 'educacion', label: 'Educación' },
  { id: 'comercio-retail', label: 'Comercio y Retail' },
];

const SOCIAL_RUBRO_LABEL = Object.fromEntries(SOCIAL_RUBROS.map((item) => [item.id, item.label]));


const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getSocialRubro = (title) => {
  const key = slugify(title || '');

  if (key.includes('vieja-taberna') || key.includes('barbarian')) return 'horeca';
  if (key.includes('yuriko') || key.includes('ginecofeme')) return 'salud';
  if (
    key.includes('design-market')
    || key === 'dm'
    || key.includes('r-c-arquitectos')
    || key.includes('ryc')
    || key.startsWith('gms')
  ) return 'construccion-inmobiliaria';
  if (key.includes('frissagio')) return 'educacion';
  if (key.includes('ellos')) return 'comercio-retail';

  return null;
};

const getLocalBrand = (slug, title) => {
  const key = slugify(slug || title || '');
  if (key.includes('elevaria')) return { src: '/logos/Elevaria Logo.png', label: 'Elevaria cafe' };
  if (key.includes('barbarian')) return { src: '/logos/Barbarian Bar.png', label: 'Barbarian Bar' };
  if (key.includes('design-market')) return { src: '/logos/Design Market.png', label: 'Design Market' };
  if (key.includes('gms')) return { src: '/logos/GMS.png', label: 'GMS' };
  if (key.includes('kanagawa')) return { src: '/logos/Kanagawa Nikkei.png', label: 'Kanagawa Nikkei' };
  if (key.includes('corte87') || key.includes('corte-87')) return { src: '/logos/Corte87.png', label: 'Corte87' };
  if (key.includes('dgary')) return { src: '/logos/DGary.png', label: 'DGary' };
  if (key.includes('yuriko')) return { src: '/logos/DRA_YURIKO.png', label: 'DRA_YURIKO' };
  if (key.includes('ryc') || key.includes('r-c-arquitectos')) return { src: '/logos/RYC arquitectos.png', label: 'RYC arquitectos' };
  if (key.includes('vieja-taberna') || key.includes('lvt')) return { src: '/logos/LaViejaTaberna.png', label: 'LaViejaTaberna' };
  if (key.includes('smashboy')) return { src: '/logos/smashboyburger.png', label: 'smashboyburger' };
  if (key.includes('ginecofeme')) return { src: '/logos/Ginecofeme.png', label: 'ginecofeme' };
  if (key.includes('frissagio')) return { src: '/logos/Frissagio.png', label: 'Frissagio' };
  if (key.includes('upn')) return { src: '/logos/upn.png', label: 'UPN' };
  if (key.includes('daniel') || key.includes('rodriguez')) return { src: '/logos/ArquitectoDanielRodriguez.png', label: 'Arq. Daniel Rodriguez' };
  if (key.includes('pascual') || key.includes('presutti')) return { src: '/logos/Pascual_Pressuti.png', label: 'Pascual Presutti' };
  if (key.includes('ellos')) return { src: '/logos/Ellos.png', label: 'Ellos' };
  return { src: null, label: null, caption: null };
};



const getLogoScaleClass = (brandLabel) => {
  if (!brandLabel) return 'scale-[1.8]';
  const name = brandLabel.trim();
  if (name === 'Barbarian Bar' || name === 'Barbarian') return 'scale-[1.44]';
  if (name === 'RYC arquitectos' || name === 'R&C Arquitectos') return 'scale-[1.0]';
  if (name === 'Frissagio') return 'scale-[0.79]';
  if (name === 'ginecofeme' || name === 'Ginecofeme') return 'scale-[0.9]';
  if (name === 'GMS') return 'scale-[1.58]';
  if (name === 'Elevaria cafe' || name === 'Elevaria') return 'scale-[1.26]';
  if (name === 'UPN') return 'scale-[1.12]';
  if (name === 'Arq. Daniel Rodriguez') return 'scale-[1.3]';
  if (name === 'Pascual Presutti') return 'scale-[0.91]';
  if (name === 'Ellos') return 'scale-[1.02]';
  return 'scale-[1.8]';
};

const getOrderFromName = (fileName) => {

  const m = fileName.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const optimizeImage = (src, width = 700) => {
  if (!src || !src.includes('/image/upload/')) return src;
  return src.replace('/image/upload/', `/image/upload/f_auto,q_auto:eco,w_${width},c_fill,ar_4:5,g_auto/`);
};

const optimizeVideoSrc = (src, width = 480) => {
  if (!src || !src.includes('/video/upload/')) return src;
  return src.replace('/video/upload/', `/video/upload/f_auto,q_auto:eco,w_${width}/`);
};

const videoPoster = (src, width = 700) => {
  if (!src || !src.includes('/video/upload/')) return src;
  return src
    .replace('/video/upload/', `/video/upload/so_1,f_jpg,q_auto:eco,w_${width}/`)
    .replace(/\.(mp4|webm)$/i, '.jpg');
};

const LazyGridVideo = ({ src, poster, className }) => {
  const videoRef = useRef(null);

  // Force .play() when the video element mounts
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // autoplay blocked — silently ignore
    });
  }, []);

  return (
    <div className="h-full w-full">
      <video
        ref={videoRef}
        src={src}
        poster={poster || undefined}
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        className={className}
      />
    </div>
  );
};

const isVideoSrc = (src) => /\.(mp4|webm)$/i.test(src || '');

const getThumbVariants = (src) => {
  if (!src) return { src: null, srcSet: null };

  if (isVideoSrc(src)) {
    const s420 = videoPoster(src, 420);
    const s700 = videoPoster(src, 700);
    const s960 = videoPoster(src, 960);
    return {
      src: s700,
      srcSet: `${s420} 420w, ${s700} 700w, ${s960} 960w`,
    };
  }

  const s420 = optimizeImage(src, 420);
  const s700 = optimizeImage(src, 700);
  const s960 = optimizeImage(src, 960);
  return {
    src: s700,
    srcSet: `${s420} 420w, ${s700} 700w, ${s960} 960w`,
  };
};

const buildPortfolioIndex = (assets) => {
  const categoriesMap = new Map();

  Object.entries(assets).forEach(([rawPath, src]) => {
    const path = rawPath.replace(/\\/g, '/');
    const match = path.match(/\/Portfolio\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!match) return;

    const [, categoryName, projectName, rest] = match;
    const categoryId = slugify(categoryName);
    const projectId = slugify(projectName);

    // Keep Social Media Doctora Yuriko but remove legacy Fotografia/DOCTORES.
    if (categoryId === 'fotografia' && projectId === 'doctores') return;

    const slug = `${categoryId}-${projectId}`;
    const fileName = rest.split('/').pop() || '';

    if (!categoriesMap.has(categoryId)) {
      categoriesMap.set(categoryId, {
        id: categoryId,
        name: categoryName,
        projects: new Map(),
      });
    }

    const category = categoriesMap.get(categoryId);
    if (!category.projects.has(slug)) {
      category.projects.set(slug, {
        slug,
        title: slug === 'fotografia-doctora-yuriko' ? 'Dra. Yuriko Cruz' : projectName,
        categoryId,
        categoryName,
        media: [],
      });
    }

    category.projects.get(slug).media.push({
      src,
      order: getOrderFromName(fileName),
      fileName,
    });
  });

  const categories = Array.from(categoriesMap.values())
    .map((category) => {
      const projects = Array.from(category.projects.values())
        .map((project) => {
          const sorted = [...project.media].sort((a, b) => {
            const aIsVideo = isVideoSrc(a.src);
            const bIsVideo = isVideoSrc(b.src);
            if (aIsVideo && !bIsVideo) return -1;
            if (!aIsVideo && bIsVideo) return 1;
            return a.order - b.order || a.fileName.localeCompare(b.fileName);
          });
          let cover = sorted[0]?.src || null;

          const thumb = getThumbVariants(cover);
          return {
            ...project,
            coverMedia: cover,
            coverVideoPoster: isVideoSrc(cover) ? videoPoster(cover, 900) : null,
            coverIsVideo: isVideoSrc(cover),
            coverSrc: thumb.src,
            coverSrcSet: thumb.srcSet,
            socialRubro: project.categoryId === 'social-media' ? getSocialRubro(project.title) : null,
            brand: getLocalBrand(project.slug, project.title),
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      return { ...category, projects };
    })
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.id);
      const ib = CATEGORY_ORDER.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  return {
    categories,
    projects: categories.flatMap((c) => c.projects),
  };
};

const buildPortfolioIndexFromApi = (items) => {
  const categoriesMap = new Map();

  for (const item of items) {
    const categoryName = item.category || 'General';
    const categoryId = slugify(categoryName);
    const title = item.title || item.companyName || 'Proyecto';
    const slug = item.slug || `${categoryId}-${slugify(title)}`;

    const mediaPool = [item.coverUrl, ...(item.medias ?? []).map((media) => media.url)].filter(Boolean);
    const uniqueMedia = Array.from(new Set(mediaPool));

    let cover = uniqueMedia[0] || null;

    const thumb = getThumbVariants(cover);

    if (!categoriesMap.has(categoryId)) {
      categoriesMap.set(categoryId, {
        id: categoryId,
        name: categoryName,
        projects: [],
      });
    }

    categoriesMap.get(categoryId).projects.push({
      slug,
      title,
      categoryId,
      categoryName,
      media: uniqueMedia.map((src, index) => ({ src, order: index, fileName: `api-${index}` })),
      coverMedia: cover,
      coverVideoPoster: isVideoSrc(cover) ? videoPoster(cover, 900) : null,
      coverIsVideo: isVideoSrc(cover),
      coverSrc: thumb.src,
      coverSrcSet: thumb.srcSet,
      socialRubro: categoryId === 'social-media' ? getSocialRubro(title) : null,
      brand: item.logoUrl
        ? {
            src: item.logoUrl,
            label: item.logoLabel || item.companyName || title,
            caption: item.logoLabel || null,
          }
        : getLocalBrand(slug, title),
    });
  }

  const categories = Array.from(categoriesMap.values())
    .map((category) => ({
      ...category,
      projects: category.projects.sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a.id);
      const ib = CATEGORY_ORDER.indexOf(b.id);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

  return {
    categories,
    projects: categories.flatMap((category) => category.projects),
  };
};

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('social-media');
  const [selectedSocialRubro, setSelectedSocialRubro] = useState('all');
  const [apiIndex, setApiIndex] = useState(null);

  const assets = getPortfolioAssets();
  const localIndex = useMemo(() => buildPortfolioIndex(assets), [assets]);
  const index = apiIndex ?? localIndex;

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

  const categories = useMemo(
    () => [
      { id: 'all', label: CATEGORY_DISPLAY.all },
      ...index.categories.map((c) => ({
        id: c.id,
        label: CATEGORY_DISPLAY[c.id] || c.name,
      })),
    ],
    [index.categories]
  );

  const projects = useMemo(() => {
    let filtered = index.projects;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categoryId === selectedCategory);
    }

    if (selectedCategory === 'social-media' && selectedSocialRubro !== 'all') {
      filtered = filtered.filter((p) => p.socialRubro === selectedSocialRubro);
    }

    return filtered;
  }, [index.projects, selectedCategory, selectedSocialRubro]);

  return (
    <motion.main
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section>
          <div className="px-2 sm:px-4 lg:px-6 py-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e73c50] font-semibold">Ideas en acción</p>
            <h1 className="mt-2 text-5xl sm:text-6xl font-display font-bold text-white leading-[0.95]">PORTAFOLIO</h1>
            <p className="mt-5 max-w-2xl text-white/65 text-lg">
              Exploramos branding, social media, audiovisual y fotografía con un enfoque estratégico y visual de alta calidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                category.id !== 'all' ? (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      if (category.id !== 'social-media') setSelectedSocialRubro('all');
                    }}
                    className={`px-4 py-2.5 rounded-md border text-sm font-semibold transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-[#e73c50] border-[#e73c50] text-white'
                        : 'border-white/15 text-white/65 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {category.label}
                  </button>
                ) : null
              ))}
            </div>

            {selectedCategory === 'social-media' && (
              <div className="mt-5 rounded-2xl border border-white/10 bg-[#0b1030]/60 p-2.5 sm:p-3">
                <p className="px-2 pb-2 text-[11px] uppercase tracking-[0.2em] text-white/45">Rubros Social Media</p>
                <div className="flex flex-wrap gap-2">
                {SOCIAL_RUBROS.map((rubro) => (
                  <button
                    key={rubro.id}
                    onClick={() => setSelectedSocialRubro(rubro.id)}
                      className={`px-3.5 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                      selectedSocialRubro === rubro.id
                        ? 'bg-[#e73c50] border-[#e73c50] text-white shadow-[0_8px_22px_rgba(231,60,80,0.28)]'
                        : 'border-white/15 bg-transparent text-white/70 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {rubro.label}
                  </button>
                ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-0 sm:p-0 lg:p-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-white/12">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.015, 0.2) }}
                  className="bg-[#080c2a]"
                >
                  <Link to={`/portfolio/${project.slug}`} className="group block">
                    <article className="relative aspect-[4/5] overflow-hidden bg-[#13183d]">
                      {project.coverIsVideo && project.coverMedia ? (
                        <LazyGridVideo
                          src={optimizeVideoSrc(project.coverMedia, 480)}
                          poster={project.coverVideoPoster || undefined}
                          className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-95 group-hover:scale-105"
                        />
                      ) : project.coverSrc ? (
                        <motion.img
                          src={project.coverSrc}
                          srcSet={project.coverSrcSet || undefined}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
                          alt={project.title}
                          loading={idx < 4 ? 'eager' : 'lazy'}
                          fetchPriority={idx < 4 ? 'high' : 'auto'}
                          decoding="async"
                          className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:opacity-95"
                          animate={{ scale: [1.02, 1.06, 1.02] }}
                          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: (idx % 6) * 0.15 }}
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(145deg,#1d2458,#121639)] opacity-85" />
                      )}

                      {/* Base overlay for consistent readability */}
                      <div className="pointer-events-none absolute inset-0 bg-black/30 transition-colors duration-300 group-hover:bg-black/55" />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/10 opacity-100 transition-colors duration-300 group-hover:from-black/85 group-hover:via-black/40" />

                      {/* Always-visible content with stronger hover contrast */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 opacity-100 transition-transform duration-300 group-hover:scale-[1.01]">
                        <div className="text-center">
                          {project.brand?.src ? (
                            <div className="mt-4 flex items-center justify-center">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center justify-center px-3 py-2">
                                  <img
                                    src={project.brand.src}
                                    alt={project.brand.label || 'Logo'}
                                    loading="eager"
                                    decoding="async"
                                    className={`max-h-[80px] sm:max-h-[96px] w-auto max-w-[280px] object-contain opacity-90 [filter:brightness(0)_invert(1)] drop-shadow-[0_4px_14px_rgba(255,255,255,0.2)] origin-center transform-gpu ${getLogoScaleClass(project.brand.label)}`}
                                    onError={(event) => {
                                      event.currentTarget.style.display = 'none';
                                    }}
                                  />
                                </div>
                                {project.brand.caption ? (
                                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
                                    {project.brand.caption}
                                  </p>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
          </section>
        </div>
      </motion.main>
  );
};

export default Portfolio;
