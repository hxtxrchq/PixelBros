import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

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

const Portfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioAssets = import.meta.glob(
    '../assets/Portfolio/**',
    { eager: true, import: 'default' }
  );

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
      className="min-h-screen bg-white pt-32 pb-20"
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
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-display font-bold mb-8 tracking-tight text-[#1F1F1F]">
            NUESTRO <span className="text-[#B3262E]">PORTFOLIO</span>
          </h1>
        </motion.div>

        {/* Category Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-16 border-b border-[#E6E6EA] pb-4"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-4 py-3 font-medium text-sm tracking-wider transition-all ${
                selectedCategory === category.id
                      ? 'text-[#B3262E]'
                      : 'text-[#4A4A4A] hover:text-[#1F1F1F]'
              }`}
            >
              {category.name}
              {selectedCategory === category.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B3262E]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid - Editorial Layout */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => {
              const categoryLabel = categories.find((c) => c.id === project.categoryId)?.label || project.categoryName;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Link to={`/portfolio/${project.slug}`}>
                    <motion.div
                      className="group relative h-[320px] sm:h-[360px] lg:h-[380px] rounded-lg border border-[#F0E6E8] overflow-hidden hover:border-[#B3262E] transition-all duration-300"
                      whileHover={{ y: -4 }}
                    >
                      {project.coverSrc ? (
                        <div
                          className="absolute inset-0"
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
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url(${project.coverSrc})` }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F6] to-[#FFFFFF]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-2xl border border-[#F0E6E8] bg-white shadow-sm flex items-center justify-center">
                              <span className="text-2xl font-display font-bold text-[#B3262E]">
                                {project.title?.charAt(0) || 'P'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/45 transition-all duration-300" />

                      <div className="absolute inset-0 flex items-end p-6">
                        <div className="translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <p className="text-xs uppercase tracking-widest text-white/80 mb-2">{categoryLabel}</p>
                          <h3 className="text-2xl font-display font-bold text-white">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-[#4A4A4A] text-lg">No hay proyectos en esta categoría</p>
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
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 text-[#1F1F1F]">
            ¿Quieres ser nuestro próximo <span className="text-[#B3262E]">caso de éxito</span>?
          </h2>
          <p className="text-[#4A4A4A] mb-10 text-lg max-w-2xl mx-auto">
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


