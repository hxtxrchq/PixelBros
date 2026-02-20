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

  const featuredProjects = portfolioIndex.projects.slice(0, 6);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#B3262E] text-sm font-semibold tracking-wide uppercase mb-3"
          >
            Casos de Éxito
          </motion.p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 tracking-tight">
            <span className="text-[#1F1F1F]">Nuestro </span>
            <span className="text-[#B3262E]">Portafolio</span>
          </h2>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Proyectos que transformaron negocios y generaron resultados reales
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
                  className="group relative h-80 rounded-lg overflow-hidden bg-[#FFF5F6]"
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Background */}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F4F4F6] to-[#FFFFFF]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-2xl border border-[#F0E6E8] bg-white shadow-sm flex items-center justify-center">
                          <span className="text-xl font-display font-bold text-[#B3262E]">
                            {project.title?.charAt(0) || 'P'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-6">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs text-white font-medium mb-3 w-fit">
                      {project.categoryName}
                    </span>
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    
                    {/* Arrow */}
                    <motion.div
                      className="inline-flex items-center text-[#B3262E] font-semibold text-sm mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
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

                  {/* Hover Effect */}
                    <motion.div
                    className="absolute inset-0 border-2 border-[#B3262E]/0 group-hover:border-[#B3262E]/40 transition-all duration-500 pointer-events-none rounded-lg"
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(179, 38, 46, 0.25)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-5 bg-[#B3262E] text-white font-bold rounded-full text-lg shadow-xl transition-all inline-flex items-center gap-3"
            >
              <span>Ver Todo el Portafolio</span>
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
