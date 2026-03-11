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

const slugify = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const getOrderFromName = (fileName) => {
  const m = fileName.match(/(\d+)/);
  return m ? Number.parseInt(m[1], 10) : Number.MAX_SAFE_INTEGER;
};

const optimizeImage = (src) => {
  if (!src || !src.includes('/image/upload/')) return src;
  return src.replace('/image/upload/', '/image/upload/f_auto,q_auto,w_900,c_fill,ar_4:5,g_auto/');
};

const videoPoster = (src) => {
  if (!src || !src.includes('/video/upload/')) return src;
  return src
    .replace('/video/upload/', '/video/upload/so_1,f_jpg,q_auto,w_900,c_fill,ar_4:5,g_auto/')
    .replace(/\.(mp4|webm)$/i, '.jpg');
};

const isVideoSrc = (src) => /\.(mp4|webm)$/i.test(src || '');

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
          return {
            ...project,
            coverSrc: isVideoSrc(cover) ? videoPoster(cover) : optimizeImage(cover),
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
    if (selectedCategory === 'all') return index.projects;
    return index.projects.filter((p) => p.categoryId === selectedCategory);
  }, [index.projects, selectedCategory]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="rounded-[30px] border border-white/10 bg-[#080c2a] overflow-hidden">
          <div className="px-6 sm:px-10 py-8 border-b border-white/10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e73c50] font-semibold">Ideas en accion</p>
            <h1 className="mt-2 text-5xl sm:text-6xl font-display font-bold text-white leading-[0.95]">PORTAFOLIO</h1>
            <p className="mt-5 max-w-2xl text-white/65 text-lg">
              Exploramos branding, social media, audiovisual y fotografia con un enfoque estrategico y visual de alta calidad.
            </p>

            <div className="mt-8 flex flex-wrap gap-2 sm:gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
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
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {projects.map((project, idx) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.015, 0.2) }}
                >
                  <Link to={`/portfolio/${project.slug}`} className="group block">
                    <article className="relative aspect-[4/5] overflow-hidden rounded-xl border border-white/12 bg-[#13183d] hover:border-[#e73c50]/60 transition-colors">
                      {project.coverSrc ? (
                        <img
                          src={project.coverSrc}
                          alt={project.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                      ) : (
                        <div className="h-full w-full bg-[linear-gradient(145deg,#1d2458,#121639)]" />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-black/8 to-transparent" />

                      <div className="absolute left-3 right-3 bottom-3">
                        <p className="text-[10px] uppercase tracking-[0.18em] text-white/65">
                          {CATEGORY_DISPLAY[project.categoryId] || project.categoryName}
                        </p>
                        <h3 className="mt-1 text-white text-sm sm:text-base font-semibold leading-tight">
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
