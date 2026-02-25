import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    id: 1,
    title: 'Identidad Visual',
    slug: 'identidad-visual',
    description: 'Creamos la imagen de tu marca desde cero. Logo, paleta de colores, tipografía y guías de estilo que hacen que tu marca sea inconfundible.',
    tag: 'Branding',
    gradient: 'linear-gradient(135deg,#2a2760 0%,#474192 50%,#6560b8 100%)',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    keywords: ['Logo', 'Paleta', 'Tipografía', 'Brand Book'],
    span: 'lg:col-span-3 lg:row-span-2',
    large: true,
  },
  {
    id: 2,
    title: 'Contenidos',
    slug: 'contenidos',
    description: 'Contenido estratégico que conecta con tu audiencia y genera engagement real en cada plataforma.',
    tag: 'Social Media',
    gradient: 'linear-gradient(135deg,#0f1b3e 0%,#1d3e8c 55%,#2e55b2 100%)',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    keywords: ['Reels', 'Copywriting', 'Calendario'],
    span: 'lg:col-span-3',
    large: false,
  },
  {
    id: 3,
    title: 'Campañas Publicitarias',
    slug: 'campanas-publicitarias',
    description: 'Estrategias 360° que maximizan tu ROI y llevan tu marca a las personas correctas.',
    tag: 'Performance',
    gradient: 'linear-gradient(135deg,#5c0f18 0%,#a82030 55%,#e73c50 100%)',
    icon: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    keywords: ['Meta Ads', 'Google Ads', 'ROI'],
    span: 'lg:col-span-3',
    large: false,
  },
  {
    id: 4,
    title: 'Fotografía',
    slug: 'fotografia-profesional',
    description: 'Imágenes de alta calidad que capturan la esencia de tu marca y cautivan a tu audiencia.',
    tag: 'Foto',
    gradient: 'linear-gradient(135deg,#1a1a52 0%,#2d2d8c 55%,#4242b2 100%)',
    icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    keywords: ['Producto', 'Editorial', '4K'],
    span: 'lg:col-span-2',
    large: false,
  },
  {
    id: 5,
    title: 'Producción Audiovisual',
    slug: 'produccion-audiovisual',
    description: 'Videos que impactan. Desde concept hasta postproducción cinematográfica.',
    tag: 'Video',
    gradient: 'linear-gradient(135deg,#1e1066 0%,#332899 55%,#4a38c8 100%)',
    icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    keywords: ['Reels', 'Spots', 'Motion'],
    span: 'lg:col-span-2',
    large: false,
  },
  {
    id: 6,
    title: 'Asesoramiento Comercial',
    slug: 'asesoramiento-comercial',
    description: 'Consultoría estratégica para potenciar tus ventas y optimizar procesos comerciales.',
    tag: 'Estrategia',
    gradient: 'linear-gradient(135deg,#032018 0%,#065438 55%,#0a7050 100%)',
    icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    keywords: ['Funnel', 'CRM', 'Conversión'],
    span: 'lg:col-span-2',
    large: false,
  },
  {
    id: 7,
    title: 'Activaciones BTL',
    slug: 'activaciones-btl',
    description: 'Experiencias presenciales y directas con tu público en eventos, lanzamientos y espacios públicos que generan impacto real.',
    tag: 'BTL',
    gradient: 'linear-gradient(135deg,#3d2200 0%,#7a4400 55%,#b06000 100%)',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    keywords: ['Eventos', 'Activaciones', 'Experiencias', 'Lanzamientos'],
    span: 'lg:col-span-6',
    large: false,
    banner: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ServiceBentoCard = ({ service }) => (
  <motion.div variants={cardVariants} className={`${service.span} h-full`}>
    <Link to={`/services/${service.slug}`} className="block h-full">
      <motion.div
        className={`group relative h-full overflow-hidden rounded-2xl transition-colors duration-300 ${
          service.large ? 'min-h-[340px]' : service.banner ? 'min-h-[140px]' : 'min-h-[200px]'
        }`}
        style={{ background: service.gradient }}
        whileHover={{ scale: 1.015, y: -3 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }} />

        <div className={`relative z-10 flex flex-col h-full ${service.banner ? 'sm:flex-row sm:items-center sm:justify-between' : ''} p-6 ${service.large ? 'lg:p-8' : ''}`}>

          {/* Tag + Icon */}
          <div className={`flex items-start justify-between ${service.banner ? 'sm:mb-0 sm:gap-6 flex-1' : 'mb-3'}`}>
            <div className="flex-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white mb-3">
                {service.tag}
              </span>
              <h3 className={`font-black text-white leading-tight ${
                service.large ? 'text-3xl lg:text-4xl' : service.banner ? 'text-2xl lg:text-3xl' : 'text-xl'
              }`}>
                {service.title}
              </h3>
            </div>
            <div className={`flex-shrink-0 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center ml-4 ${service.large ? 'w-14 h-14' : 'w-10 h-10'}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={service.large ? 'w-7 h-7' : 'w-5 h-5'}>
                <path d={service.icon} />
              </svg>
            </div>
          </div>

          {/* Description */}
          <p className={`text-white/80 leading-relaxed ${
            service.large ? 'mt-4 text-base max-w-sm' : service.banner ? 'sm:max-w-lg mt-3 sm:mt-0 text-sm' : 'mt-2 text-sm'
          }`}>
            {service.description}
          </p>

          {/* Keywords */}
          <div className={`flex flex-wrap gap-1.5 ${service.banner ? 'mt-4 sm:mt-0 sm:ml-8' : 'mt-4'}`}>
            {service.keywords.map((kw) => (
              <span key={kw} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/15 text-white/90 uppercase tracking-wide">
                {kw}
              </span>
            ))}
          </div>

          {/* Arrow (shows on hover via group) */}
          <div className="flex items-center gap-1.5 mt-5 text-white/80 font-semibold text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-250">
            <span>Ver más</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>

          {/* Decorative circles */}
          <div className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/8 pointer-events-none" />
        </div>
      </motion.div>
    </Link>
  </motion.div>
);

const Services = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-transparent pt-32 pb-24"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e73c50] mb-4">Lo que hacemos</p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-none">
            Nuestros<br />
            <span className="text-[#e73c50]">Servicios</span>
          </h1>
          <p className="text-lg text-white/55 max-w-md lg:text-right leading-relaxed">
            Soluciones integrales de marketing digital para transformar tu marca en una experiencia memorable.
          </p>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
      >
        {[
          { value: '7', label: 'Servicios especializados' },
          { value: '50+', label: 'Marcas trabajadas' },
          { value: '500+', label: 'Proyectos entregados' },
          { value: '100%', label: 'Enfoque en resultados' },
        ].map((s) => (
          <div key={s.label} className="bg-[#0d0e24] rounded-2xl px-5 py-4">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-white/50 mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* ── Bento Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-[minmax(200px,auto)] gap-4"
      >
        {SERVICES.map((service) => (
          <ServiceBentoCard key={service.id} service={service} />
        ))}
      </motion.div>

      {/* ── Process strip ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-20 mb-14"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/35 mb-8 text-center">Nuestro proceso</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { n: '01', title: 'Diagnóstico', desc: 'Analizamos tu marca, audiencia y competencia.' },
            { n: '02', title: 'Estrategia', desc: 'Definimos objetivos, KPIs y plan de acción.' },
            { n: '03', title: 'Ejecución', desc: 'Producción y lanzamiento con calidad premium.' },
            { n: '04', title: 'Optimización', desc: 'Medimos, iteramos y mejoramos continuamente.' },
          ].map((step) => (
            <div key={step.n} className="relative pl-5 border-l border-white/15">
              <p className="text-[#e73c50] text-xs font-bold mb-1">{step.n}</p>
              <h4 className="text-white font-bold mb-1">{step.title}</h4>
              <p className="text-white/50 text-sm leading-snug">{step.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative overflow-hidden rounded-3xl p-10 lg:p-14 text-center"
        style={{ background: 'linear-gradient(135deg,#1e1c50 0%,#474192 55%,#6560b8 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }} />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">
            Hablemos. Cuéntanos tu proyecto y diseñamos la estrategia perfecta para ti.
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-white text-[#06071a] font-black rounded-full text-base shadow-lg transition-all"
            >
              Agenda tu llamada gratis
            </motion.button>
          </Link>
        </div>
      </motion.div>

    </div>
  </motion.div>
);

export default Services;


