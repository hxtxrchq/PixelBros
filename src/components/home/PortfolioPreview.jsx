import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useRef } from 'react';

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

/* ─── single project card ─────────────────────────────────────── */
const ProjectCard = ({ project, index, className = '', tall = false }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const num = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      className={`group relative overflow-hidden bg-[#0d0e28] ${className}`}
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.75, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link to={`/portfolio/${project.slug}`} className="block h-full">
        {/* Media */}
        {project.coverSrc ? (
          isVideoSrc(project.coverSrc) ? (
            <video
              src={project.coverSrc}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              preload="metadata"
              muted
              playsInline
            />
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              style={{ backgroundImage: `url("${project.coverSrc}")` }}
            />
          )
        ) : (
          <div className="absolute inset-0 pb-gradient-main" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/55" />

        {/* Watermark number */}
        <div
          className="absolute top-4 right-5 text-white font-black select-none leading-none transition-opacity duration-500 opacity-[0.06]"
          style={{ fontSize: tall ? 'clamp(5rem, 9vw, 8.5rem)' : 'clamp(3.2rem, 5.5vw, 5.5rem)' }}
        >
          {num}
        </div>

        {/* Accent line – slides in from bottom on hover */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#e73c50] origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />

        {/* Text */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-7">
          <span
            className="inline-block text-[#5ab3e5] text-[10px] font-bold uppercase tracking-[0.22em] mb-2
              opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0
              transition-all duration-400 ease-out"
          >
            {project.categoryName}
          </span>

          <h3
            className="text-white font-black leading-tight transition-transform duration-500 ease-out group-hover:-translate-y-1"
            style={{ fontSize: tall ? 'clamp(1.6rem, 2.8vw, 2.6rem)' : 'clamp(1.1rem, 1.8vw, 1.6rem)' }}
          >
            {project.title}
          </h3>

          <div
            className="flex items-center gap-2 mt-3
              text-white/0 group-hover:text-white/80
              translate-y-3 group-hover:translate-y-0
              transition-all duration-400 ease-out delay-[40ms]"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">Ver proyecto</span>
            <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Border shine on hover */}
        <div className="absolute inset-0 border border-white/0 group-hover:border-white/15 transition-all duration-500 rounded-[inherit] pointer-events-none" />
      </Link>
    </motion.div>
  );
};

/* ─── main section ────────────────────────────────────────────── */
const PortfolioPreview = () => {
  const portfolioAssets = import.meta.glob(
    '../../assets/Portfolio/**',
    { eager: true, import: 'default' }
  );

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const featured = portfolioIndex.projects.slice(0, 4);
  const [p0, p1, p2, p3] = featured;

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0b1e 0%, #0d0f2a 100%)' }}
    >
      {/* Top separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#5ab3e5] font-bold mb-3">Portafolio</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-black leading-[1.05]">
              Trabajo visual
              <br />
              <span className="text-white/25">en movimiento</span>
            </h2>
          </div>

          <Link to="/portfolio">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:flex items-center gap-3 px-6 py-3 border border-white/15 rounded-full text-white/60 hover:text-white hover:border-white/35 text-sm font-semibold transition-colors"
            >
              <span>Ver todo</span>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>

        {/* Bento grid */}
        {featured.length > 0 && (
          <div
            className="grid gap-3 lg:gap-4"
            style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
          >
            {/* Card 0 — large hero, left, 3-col × 2-row */}
            {p0 && (
              <div
                className="col-span-5 lg:col-span-3"
                style={{ gridRow: 'span 2', minHeight: 'clamp(340px, 55vw, 580px)' }}
              >
                <ProjectCard project={p0} index={0} className="h-full rounded-2xl lg:rounded-3xl" tall />
              </div>
            )}

            {/* Card 1 — top-right */}
            {p1 && (
              <div className="col-span-5 lg:col-span-2" style={{ minHeight: 'clamp(200px, 26vw, 282px)' }}>
                <ProjectCard project={p1} index={1} className="h-full rounded-2xl lg:rounded-3xl" />
              </div>
            )}

            {/* Card 2 — bottom-right */}
            {p2 && (
              <div className="col-span-5 lg:col-span-2" style={{ minHeight: 'clamp(200px, 26vw, 282px)' }}>
                <ProjectCard project={p2} index={2} className="h-full rounded-2xl lg:rounded-3xl" />
              </div>
            )}

            {/* Card 3 — full-width strip */}
            {p3 && (
              <div className="col-span-5" style={{ minHeight: 'clamp(140px, 18vw, 210px)' }}>
                <ProjectCard project={p3} index={3} className="h-full rounded-2xl lg:rounded-3xl" />
              </div>
            )}
          </div>
        )}

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-10 text-center lg:hidden"
        >
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 pb-gradient-main text-white font-semibold rounded-full text-sm shadow-[0_16px_32px_rgba(69,70,161,0.28)] inline-flex items-center gap-3"
            >
              <span>Ver todo el portafolio</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
};

export default PortfolioPreview;
