import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import LogoIconPixel from '../images/LogoIconPixel.png';

// Cada miembro tiene un arreglo de "imágenes" (actualmente gradientes placeholder).
// Para agregar fotos reales: reemplaza los valores de `images` con rutas de imagen,
// y en el componente TeamCard cambia el div de gradiente por un <img src={img} />.
const TEAM = [
  {
    id: 1,
    name: 'Ana Martínez',
    role: 'CEO & Estratega',
    tag: 'Dirección',
    images: [
      'linear-gradient(135deg,#7c3aed,#db2777)',
      'linear-gradient(135deg,#9333ea,#ec4899)',
      'linear-gradient(135deg,#6d28d9,#f43f5e)',
    ],
  },
  {
    id: 2,
    name: 'Carlos Rivera',
    role: 'Director Creativo',
    tag: 'Creatividad',
    images: [
      'linear-gradient(135deg,#2563eb,#06b6d4)',
      'linear-gradient(135deg,#1d4ed8,#0891b2)',
      'linear-gradient(135deg,#3b82f6,#22d3ee)',
    ],
  },
  {
    id: 3,
    name: 'Laura González',
    role: 'Head de Marketing',
    tag: 'Marketing',
    images: [
      'linear-gradient(135deg,#dc2626,#f97316)',
      'linear-gradient(135deg,#ef4444,#fb923c)',
      'linear-gradient(135deg,#b91c1c,#ea580c)',
    ],
  },
  {
    id: 4,
    name: 'Miguel Torres',
    role: 'Director Audiovisual',
    tag: 'Audiovisual',
    images: [
      'linear-gradient(135deg,#16a34a,#14b8a6)',
      'linear-gradient(135deg,#15803d,#0d9488)',
      'linear-gradient(135deg,#22c55e,#06b6d4)',
    ],
  },
  {
    id: 5,
    name: 'Sofía Paredes',
    role: 'Diseñadora Senior',
    tag: 'Diseño',
    images: [
      'linear-gradient(135deg,#d97706,#f59e0b)',
      'linear-gradient(135deg,#b45309,#fbbf24)',
      'linear-gradient(135deg,#92400e,#f59e0b)',
    ],
  },
  {
    id: 6,
    name: 'Diego Vásquez',
    role: 'Estratega Digital',
    tag: 'Estrategia',
    images: [
      'linear-gradient(135deg,#0ea5e9,#6366f1)',
      'linear-gradient(135deg,#38bdf8,#818cf8)',
      'linear-gradient(135deg,#0284c7,#4f46e5)',
    ],
  },
  {
    id: 7,
    name: 'Valentina Cruz',
    role: 'Community Manager',
    tag: 'Social',
    images: [
      'linear-gradient(135deg,#ec4899,#f43f5e)',
      'linear-gradient(135deg,#f472b6,#fb7185)',
      'linear-gradient(135deg,#db2777,#e11d48)',
    ],
  },
  {
    id: 8,
    name: 'Mateo Ríos',
    role: 'Fotógrafo / Editor',
    tag: 'Foto & Video',
    images: [
      'linear-gradient(135deg,#475569,#94a3b8)',
      'linear-gradient(135deg,#334155,#64748b)',
      'linear-gradient(135deg,#1e293b,#475569)',
    ],
  },
  {
    id: 9,
    name: 'Isabella Morales',
    role: 'Motion Designer',
    tag: 'Motion',
    images: [
      'linear-gradient(135deg,#7c3aed,#06b6d4)',
      'linear-gradient(135deg,#6d28d9,#0ea5e9)',
      'linear-gradient(135deg,#8b5cf6,#22d3ee)',
    ],
  },
  {
    id: 10,
    name: 'Sebastián Pinto',
    role: 'Performance Ads',
    tag: 'Pauta',
    images: [
      'linear-gradient(135deg,#e73c50,#474192)',
      'linear-gradient(135deg,#f43f5e,#6366f1)',
      'linear-gradient(135deg,#dc2626,#4f46e5)',
    ],
  },
];

// Card individual con ciclo automático de imagen y hover manual
const TeamCard = ({ member, globalTick, index }) => {
  const total = member.images.length;
  const [hoverImg, setHoverImg] = useState(null);

  const activeIdx = globalTick % total;
  const displayImg = hoverImg !== null ? hoverImg : member.images[activeIdx];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: 'easeOut' }}
      className="group relative flex flex-col"
      onMouseEnter={() => setHoverImg(member.images[(activeIdx + 1) % total])}
      onMouseLeave={() => setHoverImg(null)}
    >
      {/* Card visual */}
      <div className="relative h-56 rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.45)] border border-white/10 mb-3">
        {/* Imagen / gradiente */}
        <AnimatePresence mode="wait">
          <motion.div
            key={displayImg}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="absolute inset-0"
            style={{ background: displayImg }}
          />
        </AnimatePresence>

        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
          }}
          animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        />

        {/* Tag badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/40 text-white/90 backdrop-blur-sm border border-white/15">
            {member.tag}
          </span>
        </div>

        {/* Image indicator dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {member.images.map((_, i) => (
            <motion.span
              key={i}
              className="block rounded-full bg-white"
              animate={{
                width: i === (hoverImg !== null ? (activeIdx + 1) % total : activeIdx) ? 18 : 6,
                opacity: i === (hoverImg !== null ? (activeIdx + 1) % total : activeIdx) ? 1 : 0.4,
              }}
              style={{ height: 6 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>

        {/* Glow border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: '0 0 0 0px rgba(231,60,80,0)' }}
          whileHover={{ boxShadow: '0 0 0 2px rgba(231,60,80,0.7), 0 0 40px rgba(231,60,80,0.25)' }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Info */}
      <h3 className="text-sm font-bold text-white leading-tight">{member.name}</h3>
      <p className="text-xs text-[#e73c50] font-medium mt-0.5">{member.role}</p>
    </motion.div>
  );
};

const CARD_WIDTH = 220; // px de cada card + gap para el scroll por flecha

const About = () => {
  const [globalTick, setGlobalTick] = useState(0);
  const carouselRef = useRef(null);
  const autoScrollRef = useRef(null);

  // Ciclo de imágenes cada 3s
  useEffect(() => {
    const id = setInterval(() => setGlobalTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  // Auto-scroll: cada 2.5s avanza una card; al llegar al final vuelve suavemente al inicio
  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      const el = carouselRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 4) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
      }
    }, 2500);
  };

  const stopAutoScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  const scrollLeft = () => {
    stopAutoScroll();
    carouselRef.current?.scrollBy({ left: -CARD_WIDTH, behavior: 'smooth' });
    startAutoScroll();
  };

  const scrollRight = () => {
    stopAutoScroll();
    carouselRef.current?.scrollBy({ left: CARD_WIDTH, behavior: 'smooth' });
    startAutoScroll();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero */}
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-white">
              Somos <span className="text-[#e73c50]">PixelBros</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/65 max-w-4xl mx-auto leading-relaxed">
              Una agencia de marketing digital premium que transforma marcas en experiencias inolvidables. 
              Combinamos creatividad, estrategia y tecnología para llevar tu negocio al siguiente nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
                  Nuestra <span className="text-[#e73c50]">Historia</span>
              </h2>
                <div className="space-y-4 text-white/65 text-lg">
                <p>
                  Fundada en 2020, PixelBros nació de la visión de crear una agencia diferente. 
                  Una donde el cliente no es solo un número, sino un socio en el camino hacia el éxito.
                </p>
                <p>
                  En estos años hemos trabajado con más de 50 marcas, desde startups disruptivas 
                  hasta empresas consolidadas, ayudándoles a alcanzar sus objetivos de marketing digital.
                </p>
                <p>
                  Hoy somos un equipo de profesionales apasionados por lo que hacemos, 
                  comprometidos con la excelencia y obsesionados con los resultados.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: '500+', label: 'Proyectos Completados' },
                { number: '50+', label: 'Clientes Satisfechos' },
                { number: '98%', label: 'Tasa de Retención' },
                { number: '15+', label: 'Premios Ganados' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 p-6 rounded-2xl border border-white/10"
                >
                  <AnimatedCounter
                    number={stat.number}
                    label={stat.label}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team – carrusel horizontal */}
      <section className="py-20 bg-white/3 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header + flechas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e73c50] mb-3">El equipo</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2 text-white">
                Nuestro <span className="text-[#e73c50]">Equipo</span>
              </h2>
              <p className="text-base text-white/55">
                Profesionales apasionados por crear experiencias digitales excepcionales
              </p>
            </div>

            {/* Flechas */}
            <div className="flex gap-3 flex-shrink-0">
              <motion.button
                onClick={scrollLeft}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="w-11 h-11 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Anterior"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>
              <motion.button
                onClick={scrollRight}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="w-11 h-11 rounded-full bg-[#e73c50] border border-[#e73c50] text-white flex items-center justify-center hover:bg-[#c9303f] transition-colors shadow-[0_4px_20px_rgba(231,60,80,0.4)]"
                aria-label="Siguiente"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll container con máscara de difuminado en los bordes */}
        <div className="relative">
          {/* Fade izquierdo */}
          <div
            className="absolute left-0 top-0 bottom-4 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, #1a1c52 0%, transparent 100%)' }}
          />
          {/* Fade derecho */}
          <div
            className="absolute right-0 top-0 bottom-4 w-24 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, #1a1c52 0%, transparent 100%)' }}
          />

          <div
            ref={carouselRef}
            onMouseEnter={stopAutoScroll}
            onMouseLeave={startAutoScroll}
            className="flex gap-4 overflow-x-auto scroll-smooth px-4 sm:px-8 lg:px-[calc((100vw-80rem)/2+2rem)] pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {TEAM.map((member, index) => (
              <div key={member.id} className="flex-shrink-0 w-44 sm:w-48">
                <TeamCard
                  member={member}
                  globalTick={globalTick}
                  index={index}
                />
              </div>
            ))}
            {/* padding de cierre */}
            <div className="flex-shrink-0 w-16" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 shadow-lg"
          >
            <div className="absolute inset-0">
              <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#FFF1F3] blur-3xl" />
              <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-[#F25C66]/10 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B3262E]/40 to-transparent" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center px-10 py-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#e73c50] mb-4">
                  Convocatoria creativa
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white">
                  El proximo <span className="text-[#e73c50]">PixelBros</span> podrias ser tu
                </h2>
                <p className="text-white/65 mb-8">
                  Queremos mentes inquietas, curiosas y con hambre de crear. Postula y cuentanos que te mueve.
                </p>
                <Link to="/postula">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 18px 45px rgba(179, 38, 46, 0.3)' }}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-xl text-lg shadow-lg transition-all"
                  >
                    Postula aqui
                  </motion.button>
                </Link>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative h-72 w-60">
                  <motion.div
                    className="absolute left-1/2 top-2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#111111]"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute left-1/2 top-24 h-40 w-44 -translate-x-1/2 rounded-[40px] bg-[#1F1F1F]"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute left-1/2 top-14 h-16 w-16 -translate-x-1/2 rounded-full bg-white shadow-lg"
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src={LogoIconPixel}
                      alt="PixelBros"
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute left-6 top-36 h-20 w-20 rounded-2xl border border-[#F0E6E8] bg-white shadow-md"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute right-8 top-44 h-16 w-16 rounded-full border border-[#F0E6E8] bg-[#FFF1F3] shadow-md"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;


