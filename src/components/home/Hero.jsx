import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import LogoIconPixel from '../../images/LogoIconPixel.png';

const BG_ROWS = 5;

// Smooth letter-by-letter stagger
const LetterReveal = ({ text, delay = 0, className = '', style = {} }) => {
  const letters = text.split('');
  return (
    <span className={`inline-flex overflow-hidden ${className}`} style={style} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          transition={{
            delay: delay + i * 0.045,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: char === ' ' ? 'inline-block' : undefined, minWidth: char === ' ' ? '0.3em' : undefined }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-[#1a1c52]" />

      {/* Degradados de marca */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_30%_60%,rgba(71,65,146,0.90),transparent),radial-gradient(ellipse_55%_55%_at_82%_18%,rgba(231,60,80,0.55),transparent),radial-gradient(ellipse_45%_50%_at_8%_8%,rgba(29,62,140,0.65),transparent)]" />

      {/* Patrón anillos */}
      <div className="absolute inset-0 pb-pattern-rings opacity-25" />
      <div className="absolute inset-0 pb-pattern-rings-light opacity-15" />

      {/* PIXELBROS background rows — fewer, more spaced, softer */}
      <div className="absolute inset-0" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)' }}>
        {Array.from({ length: BG_ROWS }).map((_, index) => (
          <motion.div
            key={index}
            className="absolute left-0 right-0 text-white/[0.055] font-black select-none whitespace-nowrap leading-none uppercase"
            style={{ top: `${index * 22}%`, fontSize: 'clamp(4rem, 13vw, 11rem)', letterSpacing: '0.06em' }}
            animate={{ x: index % 2 === 0 ? ['0%', '-5%', '0%'] : ['-5%', '0%', '-5%'] }}
            transition={{ duration: 12 + index * 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS
          </motion.div>
        ))}
      </div>

      {/* Floating geometric accents */}
      <motion.div
        className="absolute top-1/4 left-[8%] w-2 h-2 rounded-full bg-[#e73c50]"
        animate={{ y: [-8, 8, -8], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/3 right-[10%] w-3 h-3 rounded-sm bg-[#474192]/70 rotate-45"
        animate={{ y: [8, -8, 8], rotate: [45, 90, 45] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-[14%] w-1.5 h-1.5 rounded-full bg-[#5ab3e5]/80"
        animate={{ y: [-5, 10, -5], x: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 gap-0">

        {/* MEJORAMOS */}
        <div
          className="font-black leading-[0.9] tracking-tight uppercase text-white drop-shadow-[0_2px_32px_rgba(231,60,80,0.3)]"
          style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6.5rem)' }}
        >
          <LetterReveal text="Mejoramos" delay={0.2} />
        </div>

        {/* Logo – 1.4× title height, bouncy entrance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.3, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.55, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
          className="my-1"
        >
          <motion.img
            src={LogoIconPixel}
            alt="Pixel Bros"
            animate={{
              scale: [1, 1.18, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              scale: { delay: 1.2, duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
              rotate: { delay: 1.2, duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="w-auto drop-shadow-[0_0_32px_rgba(231,60,80,0.6)]"
            style={{ height: 'clamp(4.8rem, 16vw, 15rem)' }}
          />
        </motion.div>

        {/* TU MARCA */}
        <div
          className="font-black leading-[0.9] tracking-tight uppercase text-white drop-shadow-[0_2px_32px_rgba(231,60,80,0.3)]"
          style={{ fontSize: 'clamp(2.6rem, 7.5vw, 6.5rem)' }}
        >
          <LetterReveal text="Tu marca" delay={0.55} />
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="mt-7 text-white/55 text-base sm:text-lg max-w-md leading-relaxed font-light"
        >
          Diseño de identidad, contenido visual y estrategia de marca que convierte.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.55, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 48px rgba(231,60,80,0.40)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-[#e73c50] text-white font-bold rounded-full text-sm tracking-wider shadow-xl transition-colors"
            >
              Empieza Ahora
            </motion.button>
          </Link>
          <Link to="/portfolio">
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 bg-white/[0.07] text-white font-semibold rounded-full text-sm tracking-wider border border-white/15 backdrop-blur-sm transition-all"
            >
              Ver Portfolio →
            </motion.button>
          </Link>
        </motion.div>
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
