import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';

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

    const categorySlug = slugify(categoryName);
    const projectSlug = slugify(projectName);
    const slug = `${categorySlug}-${projectSlug}`;
    const order = getFileOrder(fileName);
    const nameKey = fileName.toLowerCase();

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
        items: [],
      });
    }

    project.groups.get(groupKey).items.push({ src, order, nameKey });
  });

  const categories = Array.from(categoriesMap.values())
    .map((category) => {
      const projects = Array.from(category.projects.values())
        .map((project) => {
          const groups = Array.from(project.groups.values())
            .map((group) => ({
              ...group,
              items: group.items
                .sort((a, b) => a.order - b.order || a.nameKey.localeCompare(b.nameKey)),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const cover = groups[0]?.items?.[0] || null;

          return {
            ...project,
            groups,
            coverSrc: cover?.src || null,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      return { ...category, projects };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const projects = categories.flatMap((category) => category.projects);

  return { categories, projects };
};

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

const ParallaxProjectCard = ({ project, index, categories }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // La imagen se mueve 12% más lento que el scroll → efecto parallax
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  const categoryLabel = categories.find((c) => c.id === project.categoryId)?.label || project.categoryName;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
    >
      <Link to={`/portfolio/${project.slug}`}>
        <motion.div
          className="group relative h-[320px] sm:h-[360px] lg:h-[400px] rounded-2xl border border-white/10 overflow-hidden hover:border-[#e73c50]/60 transition-colors duration-300"
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          {/* --- Imagen/video con parallax --- */}
          {project.coverSrc ? (
            <motion.div
              className="absolute inset-0 scale-[1.22]"
              style={{ y }}
            >
              {isVideoSrc(project.coverSrc) ? (
                <video
                  src={project.coverSrc}
                  className="h-full w-full object-cover"
                  preload="metadata"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={project.coverSrc}
                  alt={project.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              )}
            </motion.div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c52] to-[#2a2c72]">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-[#e73c50]">
                    {project.title?.charAt(0) || 'P'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-400" />

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 text-white/80 backdrop-blur-sm border border-white/10">
              {categoryLabel}
            </span>
          </div>

          {/* Title enters on hover */}
          <div className="absolute inset-0 flex items-end p-6">
            <div className="translate-y-3 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              <h3 className="text-xl font-display font-bold text-white">
                {project.title}
              </h3>
              <p className="text-xs text-[#e73c50] font-semibold mt-1 flex items-center gap-1">
                Ver proyecto
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </p>
            </div>
          </div>

          {/* Glow border on hover */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: '0 0 0 1.5px rgba(231,60,80,0.5), 0 0 40px rgba(231,60,80,0.12)' }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cursorVisible, setCursorVisible] = useState(false);

  // Custom cursor spring tracking
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springConfig = { damping: 22, stiffness: 280, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const handleGridMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left);
    cursorY.set(e.clientY - rect.top);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioAssets = getPortfolioAssets();

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const categories = useMemo(() => ([
    { id: 'all', name: 'ALL', label: 'Todos' },
    ...portfolioIndex.categories.map((category) => ({
      id: category.id,
      name: category.name.toUpperCase(),
      label: category.name,
    })),
  ]), [portfolioIndex.categories]);

  const projects = portfolioIndex.projects;

  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter((project) => project.categoryId === selectedCategory);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-transparent pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#B3262E] text-sm font-semibold tracking-widest uppercase mb-3"
          >
            MIRA NUESTROS PROYECTOS EN
          </motion.p>
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold mb-8 tracking-tight text-white">
            NUESTRO <span className="text-[#e73c50]">PORTFOLIO</span>
          </h1>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-16 border-b border-white/10 pb-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-3 font-medium text-sm tracking-wider transition-all ${
                selectedCategory === category.id
                      ? 'text-[#e73c50]'
                      : 'text-white/50 hover:text-white'
              }`}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#e73c50]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Editorial Layout */}
        <div
          className="relative cursor-none"
          onMouseMove={handleGridMouseMove}
          onMouseEnter={() => setCursorVisible(true)}
          onMouseLeave={() => setCursorVisible(false)}
        >
          {/* Custom magnetic cursor */}
          <motion.div
            className="absolute z-50 pointer-events-none top-0 left-0"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
            }}
          >
            <motion.div
              className="relative flex items-center justify-center"
              animate={{
                scale: cursorVisible ? 1 : 0,
                opacity: cursorVisible ? 1 : 0,
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Outer ring pulse */}
              <motion.div
                className="absolute w-20 h-20 rounded-full border border-[#e73c50]/40"
                animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Main circle */}
              <div className="w-16 h-16 rounded-full bg-[#e73c50] flex flex-col items-center justify-center gap-0.5 shadow-[0_0_24px_rgba(231,60,80,0.55)]">
                <span className="text-white text-[10px] font-bold tracking-[0.15em] uppercase leading-none">VER</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </motion.div>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProjects.map((project, index) => (
                <ParallaxProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                  categories={categories}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-white/50 text-lg">No hay proyectos en esta categoría</p>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">
            ¿Quieres ser nuestro próximo <span className="text-[#e73c50]">caso de éxito</span>?
          </h2>
          <p className="text-white/65 mb-10 text-lg max-w-2xl mx-auto">
            Trabajemos juntos para transformar tu negocio y alcanzar tus objetivos
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(179, 38, 46, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-[#B3262E] text-white font-bold rounded-full text-lg shadow-2xl hover:shadow-[#B3262E]/50 transition-all"
            >
              Empecemos a Trabajar
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Portfolio;


