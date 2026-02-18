import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
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
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
    },
    {
      id: 7,
      title: 'Activaciones BTL',
      slug: 'activaciones-btl',
      description: 'Experiencias presenciales y directas con el publico en eventos, lanzamientos y espacios publicos.',
      iconPath: 'M4 4h16v12H5.17L4 17.17V4zm6 4h4m-4 3h7',
      gradient: 'from-[#B3262E] to-[#B3262E]',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-white pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 text-[#1F1F1F]">
            Nuestros <span className="text-[#B3262E]">Servicios</span>
          </h1>
          <p className="text-xl text-[#4A4A4A] max-w-3xl mx-auto">
            Soluciones integrales de marketing digital para hacer crecer tu negocio
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 text-center bg-[#FFF1F3] border border-[#F0E6E8] rounded-2xl p-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-[#1F1F1F]">
            ¿Listo para transformar tu negocio?
          </h2>
          <p className="text-[#4A4A4A] mb-8 max-w-2xl mx-auto">
            Agenda una llamada gratuita y descubre cómo podemos ayudarte a alcanzar tus objetivos
          </p>
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-lg text-lg shadow-md hover:shadow-lg transition-all"
            >
              Agenda tu Llamada
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;


