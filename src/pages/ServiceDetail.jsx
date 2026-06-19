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

  if (slug === 'activaciones-btl') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-transparent"
      >
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-transparent border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7rem] font-display font-black leading-[0.9] tracking-tighter text-white uppercase select-none">
                  Activaciones<br />
                  <span className="text-[#e73c50] font-bodoni italic font-normal normal-case">BTL</span>
                </h1>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full max-w-2xl mt-4"
              >
                <div className="border-l-2 border-[#e73c50] pl-6 py-2">
                  <p className="text-lg md:text-xl text-white/70 font-normal leading-relaxed">
                    Diseñamos experiencias de marca fuera del entorno digital. Eventos, lanzamientos o intervenciones que generan interacción directa y recordación en tu público.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Bento Grid de Servicios */}
        <section className="py-20 lg:py-28 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* 1. ACTIVACIONES DE MARCA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -16, 0], x: [-5, 5, -5], scale: [1, 1.01, 1], rotate: [-1, 1, -1] }}
                transition={{ 
                  y: { duration: 5.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  x: { duration: 4.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  scale: { duration: 5.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  rotate: { duration: 5.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="md:col-span-8 bg-[#0f34d1] rounded-3xl p-8 md:p-12 flex flex-col justify-between min-h-[380px] relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute right-0 bottom-0 text-[12rem] font-display font-black text-white/5 leading-none select-none translate-x-10 translate-y-10">
                  BTL
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-end items-start">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white font-bold text-sm">
                      ★
                    </div>
                  </div>
                  <div className="mt-20">
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-4 leading-none">
                      Activaciones de marca
                    </h3>
                    <p className="text-lg text-white/90 max-w-xl font-normal leading-relaxed">
                      Generamos experiencias memorables para conectar con tu audiencia.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 2. FERIAS Y EVENTOS */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -20, 0], x: [7, -7, 7], scale: [1, 0.99, 1], rotate: [1.5, -1.5, 1.5] }}
                transition={{ 
                  y: { duration: 5.8, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  x: { duration: 5.4, delay: 0.15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  scale: { duration: 6, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  rotate: { duration: 5.6, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="md:col-span-4 bg-[#11132e] border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] relative overflow-hidden group shadow-xl"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-tight mt-6 mb-4">
                      Ferias y eventos
                    </h3>
                  </div>
                  <div className="border-t border-white/10 pt-6">
                    <p className="text-white/70 text-base leading-relaxed">
                      Diseño y ejecución de estrategias para exposiciones y convenciones.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 3. STANDS Y MOBILIARIO */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -15, 0], x: [-8, 8, -8], scale: [1, 1.015, 1], rotate: [-1.2, 1.2, -1.2] }}
                transition={{ 
                  y: { duration: 6.4, delay: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  x: { duration: 6, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  scale: { duration: 6.6, delay: 0.7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  rotate: { duration: 6.2, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="md:col-span-4 bg-[#0a0b1e] border border-white/10 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] relative overflow-hidden group shadow-xl"
              >
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-tight mt-6 mb-4">
                      Stands y mobiliario
                    </h3>
                  </div>
                  <div>
                    <div className="w-12 h-[2px] bg-[#e73c50] mb-6" />
                    <p className="text-white/70 text-base leading-relaxed">
                      Producción y montaje de espacios personalizados.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 4. ANFITRIONAJE */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -18, 0], x: [6, -6, 6], scale: [1, 0.985, 1], rotate: [1.2, -1.2, 1.2] }}
                transition={{ 
                  y: { duration: 5.4, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  x: { duration: 5, delay: 0.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  scale: { duration: 5.7, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  rotate: { duration: 5.2, delay: 0.15, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="md:col-span-4 bg-[#faf8f5] rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] relative overflow-hidden group shadow-2xl"
              >
                <div className="absolute right-6 top-6 w-16 h-16 text-[#06071a]/10 flex items-center justify-center">
                  <svg className="w-16 h-16 animate-[spin_20s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
                    <path d="M50 0 L58 35 L93 25 L65 50 L93 75 L58 65 L50 100 L42 65 L7 75 L35 50 L7 25 L42 35 Z" />
                  </svg>
                </div>
                <div className="relative z-10 flex flex-col h-full justify-between text-[#06071a]">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight mt-6 mb-4">
                      Anfitrionaje
                    </h3>
                  </div>
                  <div>
                    <p className="text-[#06071a]/85 text-base font-medium leading-relaxed">
                      Personal capacitado para representar tu marca con profesionalismo.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 5. MARKETING INTERACTIVO */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -19, 0], x: [-7, 7, -7], scale: [1, 1.01, 1], rotate: [-1.4, 1.4, -1.4] }}
                transition={{ 
                  y: { duration: 6, delay: 0.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  x: { duration: 5.6, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  scale: { duration: 6.2, delay: 0.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" },
                  rotate: { duration: 5.8, delay: 0.3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
                className="md:col-span-4 bg-gradient-to-br from-[#0c0d21] to-[#1b1c3c] border border-white/15 rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[380px] relative overflow-hidden group shadow-xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(231,60,80,0.08)_0%,transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-500" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-end items-start">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f70] animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-display font-bold text-white uppercase tracking-tight mb-4">
                      Marketing interactivo
                    </h3>
                    <p className="text-white/70 text-base leading-relaxed">
                      Estrategias digitales y tecnológicas para maximizar la interacción con el público.
                    </p>
                  </div>
                </div>
              </motion.div>

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
              className="relative mx-auto w-[97%] overflow-hidden rounded-3xl bg-white shadow-[0_8px_48px_rgba(0,0,0,0.09)] px-10 py-12 lg:px-20 lg:py-14 text-center"
            >
              <div className="hidden lg:block absolute left-[3.75rem] top-1/2 -translate-y-1/2 w-[50px] h-[116px] overflow-hidden pointer-events-none">
                <img
                  src="/icono%20izq.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain object-left"
                />
              </div>

              <div className="hidden lg:block absolute right-[4.5rem] top-1/2 -translate-y-1/2 w-[50px] h-[116px] overflow-hidden pointer-events-none">
                <img
                  src="/icono%20der.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain object-right"
                />
              </div>

              <div className="relative z-10 flex flex-col items-center gap-6 lg:gap-0">
                <div className="flex justify-center lg:hidden mb-4">
                  <img
                    src="/icono%20izq.svg"
                    alt=""
                    aria-hidden="true"
                    className="w-[60px] h-[60px] object-contain"
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-black text-[#1e1c50] leading-[1.05] mb-0" style={{ fontStretch: 'semi-expanded' }}>
                  Las buenas marcas
                </h2>
                <p className="text-3xl md:text-4xl font-bodoni italic font-normal text-[#1e1c50] leading-[1.1] mb-3">
                  no aparecen por casualidad.
                </p>
                <p className="text-[#888] mb-8 max-w-xl mx-auto text-sm sm:text-base">
                  Cuéntanos tu idea y veamos hasta donde puede llegar.
                </p>
                <Link to="/contact">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 14px 36px rgba(231,60,80,0.32)' }}
                    whileTap={{ scale: 0.97 }}
                    className="px-10 py-3.5 bg-[#e73c50] text-white font-black rounded-lg text-base shadow-md hover:bg-[#c9303f] transition-colors"
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
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
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
            <p className="text-xl text-white/65 max-w-3xl mx-auto">
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
            className="relative mx-auto w-[97%] overflow-hidden rounded-3xl bg-white shadow-[0_8px_48px_rgba(0,0,0,0.09)] px-10 py-12 lg:px-20 lg:py-14 text-center"
          >
            <div className="hidden lg:block absolute left-[3.75rem] top-1/2 -translate-y-1/2 w-[50px] h-[116px] overflow-hidden pointer-events-none">
              <img
                src="/icono%20izq.svg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain object-left"
              />
            </div>

            <div className="hidden lg:block absolute right-[4.5rem] top-1/2 -translate-y-1/2 w-[50px] h-[116px] overflow-hidden pointer-events-none">
              <img
                src="/icono%20der.svg"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain object-right"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 lg:gap-0">
              <div className="flex justify-center lg:hidden mb-4">
                <img
                  src="/icono%20izq.svg"
                  alt=""
                  aria-hidden="true"
                  className="w-[60px] h-[60px] object-contain"
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-black text-[#1e1c50] leading-[1.05] mb-0" style={{ fontStretch: 'semi-expanded' }}>
                Las buenas marcas
              </h2>
              <p className="text-3xl md:text-4xl font-bodoni italic font-normal text-[#1e1c50] leading-[1.1] mb-3">
                no aparecen por casualidad.
              </p>
              <p className="text-[#888] mb-8 max-w-xl mx-auto text-sm sm:text-base">
                Cuéntanos tu idea y veamos hasta donde puede llegar.
              </p>
              <Link to="/contact">
                <motion.button
                  whileHover={{ y: -2, boxShadow: '0 14px 36px rgba(231,60,80,0.32)' }}
                  whileTap={{ scale: 0.97 }}
                  className="px-10 py-3.5 bg-[#e73c50] text-white font-black rounded-lg text-base shadow-md hover:bg-[#c9303f] transition-colors"
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


