import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';

const ServiceDetail = () => {
  const { slug } = useParams();

  const servicesData = {
    'identidad-visual': {
      title: 'Identidad Visual',
      iconPath: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Transformamos tu visión en una identidad visual única que conecta con tu audiencia y diferencia tu marca en el mercado.',
      includes: [
        'Diseño de logotipo profesional',
        'Paleta de colores corporativa',
        'Tipografía personalizada',
        'Manual de identidad completo',
        'Aplicaciones en mockups',
        'Archivos vectoriales editables',
      ],
      benefits: [
        'Diferenciación inmediata en el mercado',
        'Mayor recordación de marca',
        'Coherencia en todos los puntos de contacto',
        'Profesionalismo que genera confianza',
        'Versatilidad para múltiples aplicaciones',
      ],
      process: [
        { step: 1, title: 'Descubrimiento', description: 'Conocemos tu negocio, valores y objetivos' },
        { step: 2, title: 'Concepto', description: 'Desarrollamos propuestas creativas alineadas a tu visión' },
        { step: 3, title: 'Diseño', description: 'Creamos tu identidad visual completa' },
        { step: 4, title: 'Refinamiento', description: 'Ajustamos hasta lograr la perfección' },
        { step: 5, title: 'Entrega', description: 'Recibes todos los archivos y el manual de marca' },
      ],
    },
    'contenidos': {
      title: 'Contenidos',
      iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Creamos contenido estratégico que cuenta tu historia, conecta emocionalmente con tu audiencia y genera resultados medibles.',
      includes: [
        'Estrategia de contenidos personalizada',
        'Calendario editorial mensual',
        'Copywriting profesional',
        'Diseño gráfico para redes sociales',
        'Gestión de comunidades',
        'Análisis y reportes mensuales',
      ],
      benefits: [
        'Aumento del engagement en redes sociales',
        'Mayor visibilidad de marca',
        'Comunidad activa y comprometida',
        'Generación constante de leads',
        'Posicionamiento como referente del sector',
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
      title: 'Campañas Publicitarias',
      iconPath: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Diseñamos y ejecutamos campañas publicitarias 360° que maximizan tu inversión y generan resultados reales.',
      includes: [
        'Estrategia publicitaria integral',
        'Gestión de campañas en Meta Ads',
        'Google Ads y Display',
        'Creatividades y copys persuasivos',
        'A/B testing continuo',
        'Reportes detallados de performance',
      ],
      benefits: [
        'ROI positivo desde el primer mes',
        'Alcance masivo en tu público objetivo',
        'Optimización constante del presupuesto',
        'Conversiones medibles y escalables',
        'Datos accionables para decisiones estratégicas',
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
      description: 'Capturamos la esencia de tu marca con imágenes profesionales que cuentan historias y generan impacto visual.',
      includes: [
        'Sesión fotográfica profesional',
        'Dirección creativa',
        'Retoque y edición profesional',
        'Banco de imágenes corporativas',
        'Fotografía de producto',
        'Fotografía lifestyle y branding',
      ],
      benefits: [
        'Contenido visual de alta calidad',
        'Mayor profesionalismo en comunicaciones',
        'Imágenes únicas y diferenciadas',
        'Material para todos tus canales',
        'Storytelling visual potente',
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
      description: 'Creamos piezas audiovisuales cinematográficas que capturan la atención y transmiten tu mensaje con impacto.',
      includes: [
        'Concepto creativo y guión',
        'Producción completa',
        'Filmación profesional 4K',
        'Edición y postproducción',
        'Motion graphics y animaciones',
        'Sonorización y música',
      ],
      benefits: [
        'Videos que generan engagement masivo',
        'Contenido versátil para múltiples plataformas',
        'Storytelling emocional y efectivo',
        'Mayor conversión en campañas',
        'Posicionamiento premium de marca',
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
      title: 'Asesoramiento Comercial',
      iconPath: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      gradient: 'from-[#B3262E] to-[#B3262E]',
      description: 'Optimizamos tus procesos comerciales y de ventas para maximizar resultados y escalar tu negocio de forma sostenible.',
      includes: [
        'Auditoría de procesos comerciales',
        'Estrategia de ventas personalizada',
        'Capacitación del equipo comercial',
        'Implementación de CRM',
        'Definición de funnels de venta',
        'KPIs y seguimiento de resultados',
      ],
      benefits: [
        'Aumento de conversión de leads',
        'Optimización de ciclo de ventas',
        'Equipo comercial más efectivo',
        'Procesos escalables y medibles',
        'Mayor rentabilidad y cierre de negocios',
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
      description: 'Diseñamos e implementamos experiencias presenciales y directas con el público para generar impacto y conversiones reales.',
      includes: [
        'Concepto creativo y narrativa de activación',
        'Planificación y logística integral',
        'Personal capacitado y coordinación en sitio',
        'Producción de materiales y montaje',
        'Permisos y gestión de proveedores',
        'Medición de resultados y reportes',
      ],
      benefits: [
        'Contacto directo con tu público objetivo',
        'Mayor recordación y reconocimiento de marca',
        'Experiencias memorables que impulsan conversión',
        'Datos reales para optimizar futuras acciones',
        'Posicionamiento diferencial en puntos clave',
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

      {/* Benefits */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-12 text-center text-white"
          >
            <span className="text-[#e73c50]">Beneficios</span> Principales
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start bg-white/5 p-6 rounded-xl border border-white/10 hover:border-[#e73c50] transition-all shadow-sm"
              >
                <div className="w-12 h-12 rounded-full bg-[#B3262E] flex items-center justify-center text-xl font-bold mr-4 flex-shrink-0 text-white">
                  {index + 1}
                </div>
                <p className="text-lg text-white/80">{benefit}</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/5 border border-white/10 rounded-2xl p-12 shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
              ¿Listo para comenzar?
            </h2>
            <p className="text-white/65 mb-8">
              Agenda una llamada gratuita y descubre cómo este servicio puede transformar tu negocio
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 15px 40px rgba(179, 38, 46, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-lg text-lg shadow-md transition-all"
              >
                Agenda tu Llamada Ahora
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ServiceDetail;


