import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceCard from '../ServiceCard';

const ServicesSection = () => {
  const services = [
    {
      id: 1,
      title: 'Identidad Visual',
      slug: 'identidad-visual',
      description: 'Creamos la imagen de tu marca desde cero. Logo, paleta de colores, tipografía y guías de estilo.',
      iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 2,
      title: 'Contenidos',
      slug: 'contenidos',
      description: 'Contenido estratégico que conecta con tu audiencia y genera engagement real.',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 3,
      title: 'Campañas Publicitarias',
      slug: 'campanas-publicitarias',
      description: 'Estrategias publicitarias 360° que maximizan tu ROI en todas las plataformas.',
      iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 4,
      title: 'Fotografía Profesional',
      slug: 'fotografia-profesional',
      description: 'Imágenes de alta calidad que cuentan tu historia y capturan la esencia de tu marca.',
      iconPath: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 5,
      title: 'Producción Audiovisual',
      slug: 'produccion-audiovisual',
      description: 'Videos que impactan. Desde concept hasta postproducción con calidad cinematográfica.',
      iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 6,
      title: 'Asesoramiento Comercial',
      slug: 'asesoramiento-comercial',
      description: 'Consultoría estratégica para potenciar tus ventas y optimizar procesos comerciales.',
      iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
          gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 7,
      title: 'Activaciones BTL',
      slug: 'activaciones-btl',
      description: 'Experiencias presenciales con impacto en puntos de venta, eventos y espacios publicos.',
      iconPath: 'M4 4h16v12H5.17L4 17.17V4zm6 4h4m-4 3h7',
      gradient: 'from-[#B3262E] to-[#B3262E]',
    },
  ];

  return (
    <section className="py-20 bg-[#FFF1F3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-display font-black mb-6 text-[#1F1F1F]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
                Servicios que <span className="text-[#B3262E]">Transforman</span>
          </motion.h2>
          <motion.p
              className="text-xl text-[#4A4A4A] max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Soluciones completas de marketing digital diseñadas para llevar tu negocio al siguiente nivel
          </motion.p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link to="/services">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-lg text-lg shadow-md hover:shadow-lg transition-all"
              >
              Ver Todos los Servicios
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
