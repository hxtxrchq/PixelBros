import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';

const CATEGORY_ORDER = [
  'diseno-de-identidad-visual',
  'social-media',
  'audiovisual',
  'fotografia',
  'menu-digital',
];

const CATEGORY_DISPLAY = {
  all: 'All',
  'diseno-de-identidad-visual': 'Branding',
  'social-media': 'Social Media',
  audiovisual: 'Audiovisual',
  fotografia: 'Fotografia',
  'menu-digital': 'Menu digital',
};

const SOCIAL_RUBROS = [
  { id: 'all', label: 'Todos los rubros' },
  { id: 'horeca', label: 'HORECA' },
  { id: 'salud', label: 'Salud' },
  { id: 'construccion-inmobiliaria', label: 'Construccion e inmobiliaria' },
  { id: 'educacion', label: 'Educacion' },
  { id: 'comercio-retail', label: 'Comercio y Retail' },
];

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

const getOrderFromName = (fileName) => {
  const m = fileName.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const optimizeImage = (src, width = 700) => {
  if (!src || !src.includes('/image/upload/')) return src;
  return src.replace('/image/upload/', `/image/upload/f_auto,q_auto:eco,w_${width},c_fill,ar_4:5,g_auto/`);
};

const videoPoster = (src, width = 700) => {
  if (!src || !src.includes('/video/upload/')) return src;
  return src
    .replace('/video/upload/', `/video/upload/so_1,f_jpg,q_auto:eco,w_${width},c_fill,ar_4:5,g_auto/`)
    .replace(/\.(mp4|webm)$/i, '.jpg');
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
        title: projectName,
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
          const sorted = [...project.media].sort((a, b) => a.order - b.order || a.fileName.localeCompare(b.fileName));
          const cover = sorted[0]?.src || null;
          const thumb = getThumbVariants(cover);
          return {
            ...project,
            coverSrc: thumb.src,
            coverSrcSet: thumb.srcSet,
            socialRubro: project.categoryId === 'social-media' ? getSocialRubro(project.title) : null,
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

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSocialRubro, setSelectedSocialRubro] = useState('all');

  const assets = getPortfolioAssets();
  const index = useMemo(() => buildPortfolioIndex(assets), [assets]);

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section>
          <div className="px-2 sm:px-4 lg:px-6 py-8">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e73c50] font-semibold">Ideas en accion</p>
            <h1 className="mt-2 text-5xl sm:text-6xl font-display font-bold text-white leading-[0.95]">PORTAFOLIO</h1>
            <p className="mt-5 max-w-2xl text-white/65 text-lg">
              Exploramos branding, social media, audiovisual y fotografia con un enfoque estrategico y visual de alta calidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
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
              ))}
            </div>

            {selectedCategory === 'social-media' && (
              <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
                {SOCIAL_RUBROS.map((rubro) => (
                  <button
                    key={rubro.id}
                    onClick={() => setSelectedSocialRubro(rubro.id)}
                    className={`px-3.5 py-2 rounded-md border text-xs sm:text-sm font-semibold transition-colors ${
                      selectedSocialRubro === rubro.id
                        ? 'bg-[#e73c50] border-[#e73c50] text-white'
                        : 'border-white/15 text-white/65 hover:border-white/35 hover:text-white'
                    }`}
                  >
                    {rubro.label}
                  </button>
                ))}
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
                      {project.coverSrc ? (
                        <img
                          src={project.coverSrc}
                          srcSet={project.coverSrcSet || undefined}
                          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
                          alt={project.title}
                          loading={idx < 4 ? 'eager' : 'lazy'}
                          fetchPriority={idx < 4 ? 'high' : 'auto'}
                          decoding="async"
                          className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(145deg,#1d2458,#121639)]" />
                      )}

                      <div className="absolute inset-0 bg-black/22 group-hover:bg-black/62 group-focus-within:bg-black/62 transition-colors duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/12 to-transparent group-hover:from-black/80 group-hover:via-black/30 transition-all duration-300" />

                      <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 transition-all duration-300">
                        <div className="inline-block rounded-md bg-black/45 backdrop-blur-[2px] px-2 py-1">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                            {CATEGORY_DISPLAY[project.categoryId] || project.categoryName}
                          </p>
                        </div>
                        <h3 className="mt-2 text-white text-sm sm:text-base font-semibold leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,1)]">
                          {project.title}
                        </h3>
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
