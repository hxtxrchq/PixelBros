import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
const LogoIconPixel = 'https://res.cloudinary.com/dhhd92sgr/image/upload/pixelbros/logos/LogoIconPixel.png';

const services = [
  {
    id: 1,
    title: 'Identidad Visual',
    slug: 'identidad-visual',
    description: 'Marca, logotipo y dirección visual que conecta con tu audiencia.',
    iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
  {
    id: 2,
    title: 'Contenidos',
    slug: 'contenidos',
    description: 'Piezas visuales y texto de alto impacto para cada plataforma.',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  },
  {
    id: 3,
    title: 'Campañas Publicitarias',
    slug: 'campanas-publicitarias',
    description: 'Campañas estructuradas para crecer y convertir.',
    iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    id: 4,
    title: 'Fotografía Profesional',
    slug: 'fotografia-profesional',
    description: 'Producción fotográfica que eleva tu imagen de marca.',
    iconPath: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 5,
    title: 'Producción Audiovisual',
    slug: 'produccion-audiovisual',
    description: 'Video creativo y comercial con narrativa de marca.',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
  {
    id: 6,
    title: 'Asesoramiento Comercial',
    slug: 'asesoramiento-comercial',
    description: 'Estrategia y consultoría para escalar tu negocio.',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
];

const TICKER_ITEMS = [
  'Identidad Visual',
  'Social Media',
  'Campañas',
  'Fotografía',
  'Producción Audiovisual',
  'Branding',
  'Estrategia',
  'BTL',
];

/* Arrow icon */
const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="none"
    className="flex-shrink-0"
  >
    <path
      d="M4 10h12m0 0l-4-4m4 4l-4 4"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Single service card */
const ServiceCard = ({ service, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/services/${service.slug}`}
        className="group relative block bg-[#0d0e24] rounded-2xl p-7 h-full overflow-hidden cursor-pointer"
      >
        {/* Top-left icon */}
        <div className="mb-8">
          <div className="w-12 h-12 flex items-center justify-center">
            <svg
              className="w-9 h-9 text-[#e73c50] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d={service.iconPath}
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-black text-white leading-tight group-hover:text-[#e73c50] transition-colors duration-300">
            {service.title}
          </h3>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex items-center gap-2 text-white/30 text-xs font-bold uppercase tracking-[0.15em] group-hover:text-[#e73c50] transition-all duration-300">
          <span>Ver servicio</span>
          <ArrowIcon />
        </div>

        {/* Hover accent line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e73c50] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />

        {/* Subtle corner glow on hover */}
        <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-[#e73c50]/8 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>
    </motion.div>
  );
};

const ServicesSection = () => {
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-40px' });

  const tickerContent = TICKER_ITEMS.flatMap((item) => [
    <span key={`t-${item}`} className="font-black uppercase tracking-[0.08em] text-[#0a0b1e]">
      {item}
    </span>,
    <img key={`s-${item}`} src={LogoIconPixel} alt="" className="h-9 w-auto mx-5 select-none flex-shrink-0" style={{ filter: 'brightness(0) opacity(0.6)' }} />,
  ]);

  return (
    <section className="pb-24 relative bg-[#06071a]">
      {/* TOP accent separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-0" />

      {/* ── Full-width marquee ticker ─────────────────────── */}
      <div className="bg-[#e73c50] py-4 overflow-hidden relative">
        <motion.div
          className="flex items-center gap-0 whitespace-nowrap text-lg"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {/* Duplicated for seamless loop */}
          {[...tickerContent, ...tickerContent]}
        </motion.div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="pt-20 mb-14 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e73c50] font-bold mb-3">Servicios</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white font-black leading-[1.05]">
              Así trabajamos
            </h2>
          </div>

          <Link to="/services">
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="hidden lg:flex items-center gap-3 px-7 py-3.5 bg-[#e73c50] text-white text-sm font-bold uppercase tracking-[0.12em] transition-all hover:bg-[#c82d40]"
            >
              <span>Ver todos</span>
              <ArrowIcon />
            </motion.div>
          </Link>
        </motion.div>

        {/* ── Service cards grid ─────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-10 text-center lg:hidden"
        >
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 bg-[#e73c50] text-white font-bold text-sm uppercase tracking-[0.12em] inline-flex items-center gap-3"
            >
              <span>Ver todos los servicios</span>
              <ArrowIcon />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;

