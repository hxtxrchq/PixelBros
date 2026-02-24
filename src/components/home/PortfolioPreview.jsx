import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo } from 'react';

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

  const projects = Array.from(categoriesMap.values())
    .flatMap((category) => Array.from(category.projects.values()))
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

  return { projects };
};

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

const PortfolioPreview = () => {
  const portfolioAssets = import.meta.glob(
    '../../assets/Portfolio/**',
    { eager: true, import: 'default' }
  );

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const featuredProjects = portfolioIndex.projects.slice(0, 4);

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col lg:flex-row gap-7 lg:items-end lg:justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#5ab3e5] font-semibold mb-2">Portafolio</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-black">
              Trabajo visual
              <br />
              en movimiento
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-[340px]">
            <motion.div
              className="aspect-square rounded-3xl pb-gradient-main pb-pattern-rings border border-white/40"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            <motion.div
              className="aspect-square rounded-3xl pb-gradient-cool pb-pattern-rings-light border border-white/40"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.4 }}
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/portfolio/${project.slug}`}>
                <motion.div
                  className="group relative h-80 sm:h-96 rounded-[1.75rem] overflow-hidden bg-[#E8EAF7] border border-white/70 shadow-[0_18px_34px_rgba(39,42,76,0.16)]"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {project.coverSrc ? (
                    <div className="absolute inset-0">
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
                          style={{ backgroundImage: `url("${project.coverSrc}")` }}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#16182f] via-[#1b204f]/65 to-transparent opacity-75 group-hover:opacity-60 transition-opacity duration-500" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 pb-gradient-main">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl border border-white/45 bg-white/10 backdrop-blur shadow-sm flex items-center justify-center">
                          <span className="text-xl font-display font-bold text-white">
                            {project.title?.charAt(0) || 'P'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="relative h-full flex flex-col justify-end p-6">
                    <span className="inline-block px-3 py-1 bg-white/12 backdrop-blur-sm border border-white/35 rounded-full text-xs text-white font-semibold mb-3 w-fit tracking-wide">
                      {project.categoryName}
                    </span>
                    <h3 className="text-3xl text-white mb-1 leading-tight">
                      {project.title}
                    </h3>
                    <motion.div
                      className="inline-flex items-center text-white/90 font-semibold text-sm mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <span className="mr-2">Ver proyecto</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="none"
                        className="transform group-hover:translate-x-1 transition-transform"
                      >
                        <path
                          d="M4 10h12m0 0l-4-4m4 4l-4 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute inset-0 border-2 border-white/0 group-hover:border-white/50 transition-all duration-500 pointer-events-none rounded-[1.75rem]"
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 pb-gradient-main text-white font-semibold rounded-full text-base sm:text-lg shadow-[0_16px_32px_rgba(69,70,161,0.28)] transition-all inline-flex items-center gap-3"
            >
              <span>Ver todo el portafolio</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M4 10h12m0 0l-4-4m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
