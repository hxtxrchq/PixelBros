import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Identidad Visual',
      slug: 'identidad-visual',
      description: 'Marca y dirección visual.',
      iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
    },
    {
      id: 2,
      title: 'Contenidos',
      slug: 'contenidos',
      description: 'Contenido de alto impacto.',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    },
    {
      id: 3,
      title: 'Campañas Publicitarias',
      slug: 'campanas-publicitarias',
      description: 'Campañas para crecer.',
      iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
    },
    {
      id: 4,
      title: 'Fotografía Profesional',
      slug: 'fotografia-profesional',
      description: 'Producción fotográfica premium.',
      iconPath: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
    },
    {
      id: 5,
      title: 'Producción Audiovisual',
      slug: 'produccion-audiovisual',
      description: 'Video creativo y comercial.',
      iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    },
    {
      id: 6,
      title: 'Asesoramiento Comercial',
      slug: 'asesoramiento-comercial',
      description: 'Estrategia para escalar.',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      id: 7,
      title: 'Activaciones BTL',
      slug: 'activaciones-btl',
      description: 'Experiencias de marca memorables.',
      iconPath: 'M4 4h16v12H5.17L4 17.17V4zm6 4h4m-4 3h7',
    },
  ];

  const cardSpans = [
    'lg:col-span-2 lg:row-span-2',
    '',
    '',
    'lg:col-span-2',
    'lg:col-span-2',
    '',
    '',
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#e73c50] font-semibold">Servicios</p>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl text-white mt-2 font-black">
              Diseño, contenido
              <br />
              y performance
            </h2>
          </div>
          <Link to="/services" className="w-fit">
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full bg-white/10 border border-white/25 text-white font-semibold shadow-[0_10px_20px_rgba(0,0,8,0.25)] hover:bg-white/20 transition-all"
            >
              Ver todos
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 rounded-full bg-white/8 border border-white/15 overflow-hidden"
        >
          <motion.div
            className="py-3 text-white/70 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            {'MEJORAMOS MARCAS • CONTENIDO • CAMPAÑAS • FOTO • VIDEO • BTL • ESTRATEGIA • MEJORAMOS MARCAS • CONTENIDO • CAMPAÑAS • FOTO • VIDEO • BTL • ESTRATEGIA • '}
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-4 sm:gap-5">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.01 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className={cardSpans[index]}
            >
              <Link
                to={`/services/${service.slug}`}
                className={`group relative block rounded-3xl border border-white/15 backdrop-blur p-5 sm:p-6 shadow-[0_14px_30px_rgba(0,0,8,0.30)] h-full overflow-hidden ${
                  index === 0 ? 'pb-gradient-main text-white'
                  : index === 4 ? 'pb-gradient-cool text-white'
                  : 'bg-white/8 text-white'
                }`}
              >
                {index === 0 && <div className="absolute inset-0 pb-pattern-rings opacity-25" />}
                {index === 4 && <div className="absolute inset-0 pb-pattern-rings-light opacity-25" />}

                <div className="relative z-10 w-12 h-12 rounded-2xl pb-gradient-main flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" d={service.iconPath} />
                  </svg>
                </div>

                <h3
                  className={`relative z-10 mb-2 transition-colors ${
                    index === 0 || index === 4
                      ? 'text-white text-2xl sm:text-3xl font-extrabold'
                      : 'text-white text-2xl font-bold group-hover:text-[#e73c50]'
                  }`}
                >
                  {service.title}
                </h3>

                <p
                  className={`relative z-10 text-sm font-medium ${
                    index === 0 || index === 4 ? 'text-white/90 max-w-sm' : 'text-white/60'
                  }`}
                >
                  {service.description}
                </p>

                {index !== 0 && index !== 4 && (
                  <motion.div
                    className="absolute -right-7 -bottom-7 w-24 h-24 rounded-full bg-white/8"
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ duration: 4.8, repeat: Infinity }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
