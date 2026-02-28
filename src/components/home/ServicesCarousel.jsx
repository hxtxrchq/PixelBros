import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';

/* ─── Service data with matched portfolio media ─────────────────── */
const SERVICES = [
  {
    id: 'identidad',
    keyword: 'Identidad Visual',
    sub: 'Marca, logotipo y dirección visual que conecta con tu audiencia.',
    slug: 'identidad-visual',
    accent: '#474192',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046500/pixelbros/Portfolio/Diseno_de_Identidad_Visual/Dulce_Cuidado/1.jpg',
    },
  },
  {
    id: 'contenidos',
    keyword: 'Contenidos',
    sub: 'Piezas visuales y texto de alto impacto para cada plataforma.',
    slug: 'contenidos',
    accent: '#e73c50',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046726/pixelbros/Portfolio/Social_Media/Design_Market/CLUB_DESING_DM.mp4',
    },
  },
  {
    id: 'campanas',
    keyword: 'Campañas',
    sub: 'Campañas estructuradas para crecer y convertir.',
    slug: 'campanas-publicitarias',
    accent: '#eb5a44',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046683/pixelbros/Portfolio/Social_Media/Barbarian_Bar/BARBARIAN_OKTUBRE_FEST.mp4',
    },
  },
  {
    id: 'fotografia',
    keyword: 'Fotografía',
    sub: 'Producción fotográfica que eleva tu imagen de marca.',
    slug: 'fotografia-profesional',
    accent: '#5ab3e5',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046610/pixelbros/Portfolio/Fotografia/DULCE_CUIDADO/DSC02914.jpg',
    },
  },
  {
    id: 'audiovisual',
    keyword: 'Producción Audiovisual',
    sub: 'Video creativo y comercial con narrativa de marca.',
    slug: 'produccion-audiovisual',
    accent: '#61bfc0',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046479/pixelbros/Portfolio/AudioVisual/Elevaria_Servido_Con_Proposito/1.mp4',
    },
  },
  {
    id: 'asesoramiento',
    keyword: 'Asesoramiento',
    sub: 'Estrategia y consultoría para escalar tu negocio.',
    slug: 'asesoramiento-comercial',
    accent: '#4357a2',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046533/pixelbros/Portfolio/Diseno_de_Identidad_Visual/Entrepenauta/1.jpg',
    },
  },
];

const INTERVAL = 4000; // ms per slide

/* ─── Media panel (left) ────────────────────────────────────────── */
const MediaPanel = ({ service }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (service.media.type === 'video' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [service.id]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={service.id}
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {service.media.type === 'video' ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={service.media.src} />
          </video>
        ) : (
          <img
            src={service.media.src}
            alt={service.keyword}
            className="w-full h-full object-cover"
            draggable={false}
          />
        )}

        {/* dark scrim so text is always legible */}
        <div className="absolute inset-0 bg-black/40" />

        {/* accent color strip at bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[3px]"
          style={{ background: service.accent }}
          layoutId="accentBar"
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Progress bar ──────────────────────────────────────────────── */
const ProgressBar = ({ accent, running }) => (
  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
    <motion.div
      key={accent + running}
      className="h-full origin-left"
      style={{ background: accent }}
      initial={{ scaleX: 0 }}
      animate={running ? { scaleX: 1 } : { scaleX: 0 }}
      transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
    />
  </div>
);

/* ─── Main component ────────────────────────────────────────────── */
const ServicesCarousel = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  /* auto-rotate */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % SERVICES.length);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  const select = useCallback((i) => {
    setActive(i);
    setPaused(true);
    // resume auto-rotation after 8 s of inactivity
    const t = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(t);
  }, []);

  const current = SERVICES[active];

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: '#06071a',
        height: '74vh',
        minHeight: '480px',
        maxHeight: '780px',
      }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* top separator */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

      <div className="h-full flex flex-col lg:flex-row max-w-6xl mx-auto w-full">

        {/* ── LEFT: media panel ─────────────────────────────────── */}
        <div className="relative w-full lg:w-[42%] h-[38%] lg:h-full flex-shrink-0 overflow-hidden">
          <MediaPanel service={current} />

          {/* bottom label on media */}
          <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
            <AnimatePresence mode="wait">
              <motion.p
                key={current.id}
                className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/50"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                Portafolio — {current.keyword}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* ── RIGHT: typography panel ───────────────────────────── */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-10 lg:px-14 py-10 lg:py-0 overflow-hidden">

          {/* eyebrow */}
          <motion.p
            className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#e73c50] mb-8 lg:mb-12"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Servicios
          </motion.p>

          {/* word list */}
          <ul className="flex flex-col gap-1 lg:gap-0">
            {SERVICES.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.id}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="block w-full text-left group relative py-1.5 lg:py-2 pl-6 focus:outline-none"
                    onClick={() => select(i)}
                    onMouseEnter={() => select(i)}
                  >
                    {/* keyword + arrow on hover */}
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="block font-black leading-tight select-none"
                        animate={{
                          color: isActive ? '#ffffff' : 'rgba(255,255,255,0.18)',
                          fontSize: isActive
                            ? 'clamp(1.4rem, 3vw, 3.6rem)'
                            : 'clamp(0.9rem, 1.7vw, 2rem)',
                          letterSpacing: isActive ? '-0.03em' : '-0.01em',
                        }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {s.keyword}
                      </motion.span>

                      {/* arrow — only when active, fades in */}
                      <motion.span
                        animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                        transition={{ duration: 0.35 }}
                        className="text-white/40 group-hover:text-white transition-colors duration-300 flex-shrink-0"
                      >
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10h12m0 0l-4-4m4 4l-4 4"
                            stroke="currentColor" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </motion.span>
                    </div>

                    {/* progress bar under active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          key="bar"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden pt-1"
                        >
                          <ProgressBar accent={s.accent} running={!paused} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* left accent line on active */}
                    <motion.div
                      className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full"
                      animate={{
                        opacity: isActive ? 1 : 0,
                        scaleY: isActive ? 1 : 0.3,
                        background: s.accent,
                      }}
                      style={{ transformOrigin: 'top' }}
                      transition={{ duration: 0.4 }}
                    />
                  </Link>

                  {/* divider */}
                  {i < SERVICES.length - 1 && (
                    <div className="h-px bg-white/5 ml-4" />
                  )}
                </li>
              );
            })}
          </ul>

          {/* "Ver todos" CTA */}
          <motion.div
            className="mt-8 lg:mt-12 pl-4"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link
              to="/services"
              className="inline-flex items-center gap-3
                text-[9px] font-bold uppercase tracking-[0.28em]
                text-white/25 hover:text-white
                transition-colors duration-300 group"
            >
              <span>Ver todos los servicios</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full
                border border-white/12 group-hover:border-white/45
                transition-all duration-300">
                <svg width="9" height="9" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12m0 0l-4-4m4 4l-4 4"
                    stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* bottom separator */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </motion.section>
  );
};

export default ServicesCarousel;
