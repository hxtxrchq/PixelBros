import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const CDN = 'https://res.cloudinary.com/dhhd92sgr';

const imageUrl = (version, path, width = 1700, height = 1000, gravity = 'auto') => (
  `${CDN}/image/upload/w_${width},h_${height},c_fill,g_${gravity},q_auto,f_auto/${version}/${path}`
);

const cardUrl = (version, path, width = 1100, height = 680, gravity = 'auto') => (
  `${CDN}/image/upload/w_${width},h_${height},c_fill,g_${gravity},q_auto,f_auto/${version}/${path}`
);

const HERO_SLIDES = [
  {
    id: 'dulce-cuidado',
    impact: 'BRANDING',
    category: 'IDENTIDAD VISUAL',
    bg: imageUrl('v1772046500', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Dulce_Cuidado/1.jpg'),
    card: cardUrl('v1772046500', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Dulce_Cuidado/1.jpg'),
  },
  {
    id: 'entrepenauta',
    impact: 'IMPACTO',
    category: 'IDENTIDAD VISUAL',
    bg: imageUrl('v1772046533', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Entrepenauta/1.jpg'),
    card: cardUrl('v1772046533', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Entrepenauta/1.jpg'),
  },
  {
    id: 'la-vieja-taberna',
    impact: 'CONTENIDO',
    category: 'FOTOGRAFIA',
    bg: imageUrl('v1772046630', 'pixelbros/Portfolio/Fotografia/LA_VIEJA_TABERNA/DSC03992.jpg'),
    card: cardUrl('v1772046630', 'pixelbros/Portfolio/Fotografia/LA_VIEJA_TABERNA/DSC03992.jpg'),
  },
];

const INTRO_MS = 3400;
const SLIDE_MS = 8000;

const getRelativeOffset = (cardIndex, activeIndex, total) => {
  let offset = cardIndex - activeIndex;
  const half = Math.floor(total / 2);
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
};

const Hero = () => {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState('intro');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setStage('slider'), INTRO_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage !== 'slider') return undefined;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [stage]);

  const current = useMemo(() => HERO_SLIDES[index], [index]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05061a]">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: stage === 'intro' ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6 }}
        style={{ background: 'radial-gradient(circle at 50% 35%, #343878 0%, #1d2050 56%, #05061a 100%)' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2].map((row) => (
            <div
              key={row}
              className="absolute left-0 right-0 text-white/[0.045] font-black uppercase whitespace-nowrap leading-none"
              style={{ top: `${8 + row * 31}%`, fontSize: 'clamp(5rem, 12vw, 10rem)' }}
            >
              PIXELBROS PIXELBROS PIXELBROS
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ opacity: stage === 'slider' ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id}
            src={current.bg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.5 }}
            draggable={false}
          />
        </AnimatePresence>
        <div className="absolute inset-0 scale-[1.06]" style={{ filter: 'blur(10px)' }}>
          <img src={current.bg} alt="" className="h-full w-full object-cover opacity-58" draggable={false} />
        </div>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(9,11,36,0.56) 0%, rgba(7,9,30,0.7) 60%, rgba(5,6,26,0.95) 100%)' }}
      />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-24 pb-14">
        <motion.div
          className="relative w-full max-w-4xl h-[220px] sm:h-[270px] flex items-center justify-center"
          animate={{ y: stage === 'intro' ? -8 : -46 }}
          transition={{ duration: reduceMotion ? 0 : 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="absolute top-[13%] text-white text-[11px] sm:text-[14px] font-medium tracking-[0.24em] uppercase">
            MEJORAMOS
          </p>
          <h1 className="font-display font-bold uppercase text-white text-center leading-[0.9]" style={{ fontSize: 'clamp(2.5rem, 6.9vw, 5.4rem)' }}>
            TU MARCA
            <br />
            <span className="whitespace-nowrap">
              CON{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={stage === 'intro' ? 'impacto' : current.impact}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24 }}
                  className="text-[#ff455f]"
                >
                  {stage === 'intro' ? 'IMPACTO' : current.impact}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </motion.div>

        <div className={`relative w-full ${stage === 'intro' ? 'max-w-md h-[96px]' : 'max-w-5xl h-[360px] sm:h-[400px]'}`}>
          <AnimatePresence mode="wait">
            {stage === 'intro' ? (
              <motion.div
                key="intro-actions"
                className="absolute inset-x-0 top-0 flex items-center justify-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: reduceMotion ? 0 : 0.48, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link to="/contact">
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-[#242848] font-semibold rounded-md text-sm sm:text-base">
                    Empieza ahora
                  </motion.button>
                </Link>
                <Link to="/portfolio">
                  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#ff455f] text-white font-semibold rounded-md text-sm sm:text-base">
                    Ver portafolio
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <motion.div
                key="slider-content"
                className="absolute inset-x-0 -top-12 sm:-top-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 34 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: reduceMotion ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative w-full max-w-[900px] h-[196px] sm:h-[250px] md:h-[270px]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {HERO_SLIDES.map((slide, cardIndex) => {
                      const offset = getRelativeOffset(cardIndex, index, HERO_SLIDES.length);
                      const isActive = offset === 0;
                      const absOffset = Math.abs(offset);

                      return (
                        <motion.div
                          key={slide.id}
                          className="absolute w-[248px] h-[154px] sm:w-[352px] sm:h-[216px] md:w-[404px] md:h-[248px]"
                          initial={false}
                          animate={{
                            x: `${offset * 42}%`,
                            y: isActive ? 0 : 6,
                            scale: isActive ? 1 : 0.83,
                            rotateY: offset * -11,
                            z: isActive ? 30 : -40,
                            opacity: absOffset > 1 ? 0 : (isActive ? 1 : 0.78),
                            filter: isActive ? 'blur(0px) saturate(1)' : 'blur(0.6px) saturate(0.75)',
                          }}
                          transition={reduceMotion ? { duration: 0 } : {
                            type: 'spring',
                            stiffness: 180,
                            damping: 28,
                            mass: 0.85,
                          }}
                          style={{
                            transformStyle: 'preserve-3d',
                            zIndex: isActive ? 40 : 20 - absOffset,
                            willChange: 'transform, opacity, filter',
                            boxShadow: isActive
                              ? '0 20px 42px rgba(0,0,0,0.46)'
                              : '0 10px 22px rgba(0,0,0,0.26)',
                          }}
                        >
                          <div className="relative h-full w-full overflow-hidden rounded-[10px] sm:rounded-[12px]">
                            <img
                              src={slide.card}
                              alt=""
                              className="h-full w-full object-cover"
                              loading={isActive ? 'eager' : 'lazy'}
                              draggable={false}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060719]/40 via-transparent to-transparent" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <p className="mt-2 text-white/85 text-[12px] sm:text-[13px] tracking-[0.2em] uppercase">
                  ASI TRABAJAMOS EN <span className="text-[#ff455f] font-semibold">{current.category}</span>
                </p>

                <div className="mt-3 flex items-center justify-center gap-3 sm:gap-4">
                  <Link to="/contact">
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 sm:px-8 sm:py-3 bg-white text-[#242848] font-semibold rounded-md text-sm sm:text-base">
                      Empieza ahora
                    </motion.button>
                  </Link>
                  <Link to="/portfolio">
                    <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="px-6 py-2.5 sm:px-8 sm:py-3 bg-[#ff455f] text-white font-semibold rounded-md text-sm sm:text-base">
                      Ver portafolio
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '180px', background: 'linear-gradient(to bottom, transparent 0%, rgba(5,6,26,0.6) 55%, #05061a 100%)' }}
      />
    </section>
  );
};

export default Hero;