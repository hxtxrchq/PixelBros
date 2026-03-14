import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { slug } = useParams();

  const servicesData = {
    'identidad-visual': {
      title: 'Branding',
      iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Trabajamos la base de tu marca para que tenga una dirección clara. Definimos su identidad visual y lineamientos de comunicación para que todo lo que publiques mantenga coherencia.',
      includes: [
        'Logo principal',
        'Variaciones de logo',
        'Paleta de colores (principales y secundarios)',
        'Tipografías de marca',
        'Usos correctos del logo',
        'Aplicaciones básicas',
        'Manual de marca resumido',
        'Archivos editables y finales',
      ],
      process: [
        { step: 1, title: 'Brief del proyecto', description: 'Entendimiento del negocio, objetivos de marca, público y contexto.' },
        { step: 2, title: 'Análisis de marca', description: 'Diagnóstico de la marca actual: personalidad, percepción, valores y oportunidades.' },
        { step: 3, title: 'Análisis de competencia', description: 'Mapa competitivo, referentes del sector y espacios de diferenciación.' },
        { step: 4, title: 'Proceso creativo', description: 'Exploración conceptual, moodboard, dirección visual y desarrollo de propuestas.' },
        { step: 5, title: 'Selección tipográfica', description: 'Elección estratégica de tipografías y su rol dentro del sistema visual.' },
        { step: 6, title: 'Sistema y manual de marca', description: 'Construcción del universo visual: logo, colores, tipografía, usos y lineamientos.' },
        { step: 7, title: 'Entregables finales', description: 'Archivos editables + paquete completo de marca listo para implementar.' },
      ],
    },
    'contenidos': {
      title: 'Gestión de Contenidos',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Creamos contenido que muestra lo mejor de tu marca y amplía su alcance en redes. Combinamos creatividad y anuncios para atraer más público y generar oportunidades de venta.',
      includes: [
        'Estrategia de contenido personalizada',
        'Planificación y cronograma de contenido',
        'Copywriting',
        'Diseños, fotografía y audiovisual para redes sociales',
        'Gestión de historias',
        'Publicidad digital y anuncios para ventas',
        'Análisis de rendimiento y reportes',
      ],
      process: [
        { step: 1, title: 'Análisis', description: 'Estudiamos tu marca, audiencia y competencia' },
        { step: 2, title: 'Estrategia', description: 'Definimos objetivos, tono y pilares de contenido' },
        { step: 3, title: 'Creación', description: 'Producimos contenido de alto valor' },
        { step: 4, title: 'Publicación', description: 'Gestionamos tu presencia en redes' },
        { step: 5, title: 'Optimización', description: 'Analizamos y mejoramos continuamente' },
      ],
    },
    'campanas-publicitarias': {
      title: 'Publicidad Digital',
      iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Creamos y gestionamos campañas en plataformas digitales para llegar a las personas correctas. Segmentamos, optimizamos y analizamos cada anuncio para que tu inversión tenga resultados claros.',
      includes: [
        'Estrategia publicitaria integral',
        'Gestión de campañas en Meta Ads',
        'Google Ads y Display',
        'Creatividades y copys persuasivos',
        'A/B testing continuo',
        'Reportes detallados de performance',
      ],
      process: [
        { step: 1, title: 'Investigación', description: 'Analizamos mercado, competencia y audiencia' },
        { step: 2, title: 'Planificación', description: 'Definimos objetivos, presupuesto y KPIs' },
        { step: 3, title: 'Ejecución', description: 'Lanzamos campañas optimizadas' },
        { step: 4, title: 'Monitoreo', description: 'Seguimiento en tiempo real del performance' },
        { step: 5, title: 'Escalamiento', description: 'Invertimos más en lo que funciona' },
      ],
    },
    'fotografia-profesional': {
      title: 'Fotografía Profesional',
      iconPath: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Realizamos sesiones fotográficas que destacan lo mejor de tu marca.',
      includes: [
        'Sesión fotográfica profesional',
        'Dirección creativa',
        'Retoque y edición profesional',
        'Banco de imágenes corporativas',
        'Fotografía de producto',
        'Fotografía lifestyle y branding',
      ],
      process: [
        { step: 1, title: 'Briefing', description: 'Entendemos tu necesidad y visión' },
        { step: 2, title: 'Concepto', description: 'Desarrollamos moodboard y propuesta creativa' },
        { step: 3, title: 'Producción', description: 'Realizamos la sesión fotográfica' },
        { step: 4, title: 'Edición', description: 'Retocamos y perfeccionamos cada imagen' },
        { step: 5, title: 'Entrega', description: 'Recibes tu banco de imágenes listo para usar' },
      ],
    },
    'produccion-audiovisual': {
      title: 'Producción Audiovisual',
      iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Desarrollamos piezas de video desde la idea hasta la edición final. Contenido audiovisual pensado para comunicar de forma clara y generar mayor impacto en plataformas digitales.',
      includes: [
        'Concepto creativo y guión',
        'Producción completa',
        'Filmación profesional 4K',
        'Edición y postproducción',
        'Motion graphics y animaciones',
        'Sonorización y música',
      ],
      process: [
        { step: 1, title: 'Pre-producción', description: 'Guión, storyboard y planificación' },
        { step: 2, title: 'Filmación', description: 'Grabación con equipo profesional' },
        { step: 3, title: 'Edición', description: 'Montaje y narrativa visual' },
        { step: 4, title: 'Post-producción', description: 'Efectos, color grading y audio' },
        { step: 5, title: 'Entrega', description: 'Video final en todos los formatos necesarios' },
      ],
    },
    'asesoramiento-comercial': {
      title: 'Estrategia Comercial',
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Analizamos tu negocio para encontrar oportunidades de crecimiento. Te ayudamos a ordenar tu oferta, mejorar tu comunicación y definir acciones que impulsen tus ventas.',
      includes: [
        'Auditoría de procesos comerciales',
        'Estrategia de ventas personalizada',
        'Capacitación del equipo comercial',
        'Implementación de CRM',
        'Definición de funnels de venta',
        'KPIs y seguimiento de resultados',
      ],
      process: [
        { step: 1, title: 'Diagnóstico', description: 'Analizamos tu situación actual' },
        { step: 2, title: 'Estrategia', description: 'Diseñamos plan comercial a medida' },
        { step: 3, title: 'Implementación', description: 'Aplicamos mejoras en procesos' },
        { step: 4, title: 'Capacitación', description: 'Formamos a tu equipo' },
        { step: 5, title: 'Seguimiento', description: 'Monitoreamos y ajustamos continuamente' },
      ],
    },
    'activaciones-btl': {
      title: 'Activaciones BTL',
      iconPath: 'M4 4h16v12H5.17L4 17.17V4zm6 4h4m-4 3h7',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Diseñamos experiencias de marca fuera del entorno digital. Eventos, lanzamientos o intervenciones que generan interacción directa y recordación en tu público.',
      includes: [
        'Concepto creativo y narrativa de activación',
        'Planificación y logística integral',
        'Personal capacitado y coordinación en sitio',
        'Producción de materiales y montaje',
        'Permisos y gestión de proveedores',
        'Medición de resultados y reportes',
      ],
      process: [
        { step: 1, title: 'Briefing', description: 'Definimos objetivos, público y contexto' },
        { step: 2, title: 'Concepto', description: 'Desarrollamos la experiencia y el mensaje' },
        { step: 3, title: 'Planificación', description: 'Logística, recursos y cronograma' },
        { step: 4, title: 'Ejecución', description: 'Implementación y supervisión en sitio' },
        { step: 5, title: 'Resultados', description: 'Medimos impacto y conversiones' },
      ],
    },
  };

  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold mb-4 text-white">Servicio no encontrado</h1>
          <Link to="/services" className="text-[#B3262E] hover:text-[#B3262E]/80">
            Volver a servicios
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-lg bg-[#B3262E]/10 flex items-center justify-center border border-[#B3262E]/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg 
                className="w-10 h-10 text-[#B3262E]" 
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d={service.iconPath} />
              </svg>
            </motion.div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-white">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/65 max-w-3xl mx-auto">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-12 text-center text-white"
          >
            ¿Qué <span className="text-[#e73c50]">Incluye?</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.includes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#e73c50] transition-all group"
              >
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-[#B3262E] mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-white/80 group-hover:text-[#e73c50] transition-colors">{item}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-12 text-center text-white"
          >
            Nuestro <span className="text-[#e73c50]">Proceso</span>
          </motion.h2>
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#B3262E]/20" />

            {service.process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#e73c50] transition-all">
                    <h3 className="text-2xl font-display font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-white/65">{item.description}</p>
                  </div>
                </div>
                
                {/* Step Number */}
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-[#B3262E] items-center justify-center text-2xl font-bold shadow-lg z-10 text-white">
                  {item.step}
                </div>
                
                <div className="w-full md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative mx-auto w-[97%] overflow-hidden rounded-3xl p-10 lg:p-14 text-center"
            style={{ background: 'linear-gradient(135deg,#1e1c50 0%,#474192 55%,#6560b8 100%)' }}
          >
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
              }}
            />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
                Las buenas marcas no aparecen por casualidad
              </h2>
              <p className="text-white/75 mb-8 max-w-xl mx-auto">
                Cuéntanos tu idea y veamos hasta dónde puede llegar.
              </p>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-4 bg-white text-[#06071a] font-black rounded-full text-base shadow-lg transition-all"
                >
                  Empezar proyecto
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ServiceDetail;


