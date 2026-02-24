import { motion } from 'framer-motion';
import LogoIconPixel from '../../images/LogoIconPixel.png';

// Solo PIXELBROS en el fondo – 8 filas cubren toda la pantalla
const BG_ROWS = 8;

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Fondo base */}
      <div className="absolute inset-0 bg-[#1a1c52]" />

      {/* Degradado de marca */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_30%_60%,rgba(71,65,146,0.90),transparent),radial-gradient(ellipse_55%_55%_at_82%_18%,rgba(231,60,80,0.55),transparent),radial-gradient(ellipse_45%_50%_at_8%_8%,rgba(29,62,140,0.65),transparent)]" />

      {/* Patrón anillos */}
      <div className="absolute inset-0 pb-pattern-rings opacity-30" />
      <div className="absolute inset-0 pb-pattern-rings-light opacity-20" />

      {/* Solo "PIXELBROS" repetido en cada fila */}
      {Array.from({ length: BG_ROWS }).map((_, index) => (
        <motion.div
          key={index}
          className="absolute left-0 right-0 text-white/[0.11] font-black select-none whitespace-nowrap leading-none uppercase"
          style={{
            top: `${index * 13}%`,
            fontSize: 'clamp(5rem, 16vw, 14rem)',
          }}
          animate={{ x: index % 2 === 0 ? ['0%', '-6%', '0%'] : ['-6%', '0%', '-6%'] }}
          transition={{ duration: 8 + index * 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          PIXELBROS&nbsp;&nbsp;&nbsp;PIXELBROS&nbsp;&nbsp;&nbsp;PIXELBROS&nbsp;&nbsp;&nbsp;PIXELBROS
        </motion.div>
      ))}

      {/* Contenido principal: MEJORAMOS → Logo → TU MARCA */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-20 pb-12">

        {/* MEJORAMOS */}
        <motion.p
          initial={{ opacity: 0, y: 32, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.01em' }}
          transition={{ delay: 0.05, duration: 0.7, ease: 'easeOut' }}
          className="text-white font-black leading-none tracking-tight uppercase drop-shadow-[0_2px_24px_rgba(231,60,80,0.4)]"
          style={{ fontSize: 'clamp(3.2rem, 11vw, 9.5rem)' }}
        >
          Mejoramos
        </motion.p>

        {/* Logo – mismo tamaño visual que una línea del título */}
        <motion.img
          src={LogoIconPixel}
          alt="Pixel Bros"
          initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
          animate={{
            opacity: 1,
            scale: [1, 1.06, 1],
            rotate: [0, -4, 4, 0],
          }}
          transition={{
            opacity: { duration: 0.45, ease: 'easeOut' },
            scale: { delay: 0.3, duration: 2.8, repeat: Infinity, ease: 'easeInOut' },
            rotate: { delay: 0.3, duration: 3.4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="my-2 w-auto drop-shadow-[0_0_40px_rgba(231,60,80,0.55)]"
          style={{ height: 'clamp(3.2rem, 11vw, 9.5rem)' }}
        />

        {/* TU MARCA */}
        <motion.p
          initial={{ opacity: 0, y: -32, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.01em' }}
          transition={{ delay: 0.25, duration: 0.7, ease: 'easeOut' }}
          className="text-white font-black leading-none tracking-tight uppercase drop-shadow-[0_2px_24px_rgba(231,60,80,0.4)]"
          style={{ fontSize: 'clamp(3.2rem, 11vw, 9.5rem)' }}
        >
          Tu marca
        </motion.p>

      </div>
    </section>
  );
};

export default Hero;
