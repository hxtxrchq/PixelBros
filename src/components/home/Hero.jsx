import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import feat1 from '../../assets/Portfolio/Diseño de Identidad Visual/Dulce Cuidado/1.jpg';
import feat2 from '../../assets/Portfolio/Diseño de Identidad Visual/Entrepenauta/1.jpg';
import feat3 from '../../assets/Portfolio/Diseño de Identidad Visual/Laboralis/1.jpg';

const FEATURED = [
  { src: feat1, category: 'Identidad Visual', client: 'Dulce Cuidado', num: '01' },
  { src: feat2, category: 'Branding', client: 'Entrepenauta', num: '02' },
  { src: feat3, category: 'Diseño', client: 'Laboralis', num: '03' },
];

const Hero = () => {
  const [featIndex, setFeatIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setFeatIndex((i) => (i + 1) % FEATURED.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05061a] flex items-center">
      {/* Monochromatic indigo radial spotlights */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 75% 85% at 85% 10%, #2d317c 0%, #1a1c52 38%, transparent 65%)' }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 55% 65% at 8% 92%, #22265a 0%, transparent 60%)' }}
      />

      {/* PIXELBROS watermark rows */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 text-white/[0.04] font-black select-none whitespace-nowrap leading-none uppercase"
            style={{ top: `${i * 22}%`, fontSize: 'clamp(4.5rem, 13vw, 11rem)', letterSpacing: '0.06em' }}
            animate={{ x: i % 2 === 0 ? ['0%', '-5%', '0%'] : ['-5%', '0%', '-5%'] }}
            transition={{ duration: 13 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS
          </motion.div>
        ))}
      </div>

      {/* Floating micro-dots */}
      <motion.div
        className="absolute top-1/4 left-[5%] w-2 h-2 rounded-full bg-[#e73c50]"
        animate={{ y: [-8, 8, -8], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-[7%] w-1.5 h-1.5 rounded-full bg-[#474192]/80"
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 4.2, repeat: Infinity }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-28 lg:pt-24 pb-16">

        {/* Floating image card — desktop only, absolutely positioned */}
        <motion.div
          initial={{ opacity: 0, y: 30, rotate: 0 }}
          animate={{ opacity: 1, y: 0, rotate: -3.5 }}
          transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="hidden lg:block absolute right-2 top-10 z-20"
          style={{ width: 'clamp(220px, 26vw, 360px)' }}
        >
          {/* Accent line above card */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-[2px] bg-[#e73c50] mb-3 rounded-full"
            style={{ originX: 0 }}
          />
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              aspectRatio: '4/5',
              boxShadow: '0 40px 100px rgba(5,6,26,0.9), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={featIndex}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ clipPath: 'inset(0 0% 0 100%)' }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.18, 1] }}
                className="absolute inset-0"
              >
                <img
                  src={FEATURED[featIndex].src}
                  alt={FEATURED[featIndex].client}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* Project label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${featIndex}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute bottom-0 left-0 right-0 p-5 z-10"
              >
                <span className="text-[#e73c50] text-[9px] font-bold uppercase tracking-[0.25em] block mb-1">
                  {FEATURED[featIndex].category}
                </span>
                <span className="text-white font-bold text-lg leading-tight tracking-tight">
                  {FEATURED[featIndex].client}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Side indicators */}
            <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
              {FEATURED.map((_, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setFeatIndex(i)}
                  animate={{ height: i === featIndex ? 24 : 8, opacity: i === featIndex ? 1 : 0.3, backgroundColor: i === featIndex ? '#e73c50' : '#ffffff' }}
                  transition={{ duration: 0.3 }}
                  className="w-[3px] rounded-full"
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
              <motion.div
                key={`prog-${featIndex}`}
                className="h-full bg-[#e73c50]"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
              />
            </div>
          </div>
        </motion.div>

        {/* HEADLINE — full editorial width */}
        <div className="relative lg:max-w-[62%]">

          <div className="font-black leading-[0.85] tracking-tight uppercase mb-10">
            {/* MEJORAMOS — thin contrast */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/30 font-light tracking-[0.12em] block"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 2rem)', letterSpacing: '0.18em', marginBottom: '0.15em' }}
            >
              MEJORAMOS
            </motion.div>

            {/* TU MARCA — massive */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center flex-wrap gap-x-4"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 6rem)' }}
            >
              <span className="text-white">TU</span>
              <span
                className="text-white bg-[#e73c50] px-4 rounded-2xl"
                style={{ paddingTop: '0.02em', paddingBottom: '0.06em', lineHeight: 1 }}
              >
                MARCA
              </span>
            </motion.div>

            {/* CON IMPACTO */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="text-white flex items-baseline gap-4"
              style={{ fontSize: 'clamp(2.6rem, 5.5vw, 6rem)' }}
            >
              <motion.span
                className="text-[#e73c50] inline-block"
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ fontSize: '0.6em', lineHeight: 1 }}
              >
                →
              </motion.span>
              <span>CON IMPACTO</span>
            </motion.div>
          </div>

          {/* Tagline + CTAs */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="text-white/45 text-sm sm:text-base max-w-sm leading-relaxed font-light mb-8"
          >
            Diseño de identidad, contenido visual y estrategia de marca que convierte.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.65 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 48px rgba(231,60,80,0.45)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-[#e73c50] text-white font-bold rounded-full text-sm tracking-wider shadow-xl"
              >
                Empieza Ahora
              </motion.button>
            </Link>
            <Link to="/portfolio">
              <motion.button
                whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.97 }}
                className="px-8 py-4 bg-white/[0.07] text-white font-semibold rounded-full text-sm tracking-wider backdrop-blur-sm transition-all"
              >
                Ver Portfolio →
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-semibold">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent"
          style={{ originY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
