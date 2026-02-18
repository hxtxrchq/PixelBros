import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../AnimatedCounter';
import TypewriterText from '../TypewriterText';
import inicio1 from '../../assets/Inicio/1.png';
import inicio3 from '../../assets/Inicio/3.jpg';
import inicio4 from '../../assets/Inicio/4.jpg';
import inicio5 from '../../assets/Inicio/5.jpg';

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const typewriterTexts = [
    'Creatividad',
    'Marca',
    'Negocio',
    'Visión',
  ];

  // Imagenes reales para el slider visual
  const sliderImages = [
    { id: 1, src: inicio1, alt: 'Proyecto destacado 1' },
    { id: 2, src: inicio3, alt: 'Proyecto destacado 2' },
    { id: 3, src: inicio4, alt: 'Proyecto destacado 3' },
    { id: 4, src: inicio5, alt: 'Proyecto destacado 4' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % sliderImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-[#1F1F1F]">Elevamos tu </span>
              <TypewriterText
                texts={typewriterTexts}
                className="text-[#B3262E]"
                speed={150}
                deleteSpeed={80}
                pauseTime={1500}
              />
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-[#4A4A4A] mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Estrategia digital premium con resultados reales.{' '}
              <span className="text-[#B3262E] font-bold">Impacto</span> que genera{' '}
              <span className="text-[#B3262E] font-bold">conversión</span>.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Link to="/portfolio">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 24px rgba(179, 38, 46, 0.28)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-[#B3262E] text-white font-bold rounded-lg text-lg shadow-md transition-all"
                >
                  Ver Portafolio
                </motion.button>
              </Link>

              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 24px rgba(179, 38, 46, 0.2)' }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-5 bg-white border-2 border-[#B3262E] text-[#B3262E] font-bold rounded-lg text-lg transition-all hover:bg-[#B3262E] hover:text-white"
                >
                  Contactar Ahora
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-8 mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              {[
                { number: '500+', label: 'Proyectos' },
                { number: '98%', label: 'Satisfacción' },
                { number: '50+', label: 'Clientes' },
              ].map((stat, index) => (
                <AnimatedCounter
                  key={stat.label}
                  number={stat.number}
                  label={stat.label}
                  delay={1.2 + index * 0.1}
                />
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Slider Element */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative h-[500px] lg:h-[600px]"
          >
            <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(242,92,102,0.35),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(255,122,60,0.35),transparent_60%)] blur-2xl" />
            <svg
              className="absolute inset-0 w-full h-full opacity-50"
              viewBox="0 0 600 600"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="heroGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="12" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M -40 120 C 80 40, 200 220, 360 140 S 560 160, 640 260"
                stroke="#F25C66"
                strokeWidth="2"
                fill="none"
                filter="url(#heroGlow)"
              />
              <path
                d="M -20 460 C 120 380, 260 520, 420 440 S 600 460, 680 540"
                stroke="#FF7A3C"
                strokeWidth="2"
                fill="none"
                filter="url(#heroGlow)"
              />
            </svg>
            <div className="relative w-full h-full">
              {sliderImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  className="absolute inset-0 rounded-3xl bg-white flex items-center justify-center border border-[#F0E6E8] shadow-lg overflow-hidden"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{
                    opacity: index === currentImageIndex ? 1 : 0,
                    scale: index === currentImageIndex ? 1 : 0.8,
                    rotateY: index === currentImageIndex ? 0 : -20,
                    zIndex: index === currentImageIndex ? 10 : 1,
                  }}
                  transition={{ duration: 0.8 }}
                  style={{
                    boxShadow:
                      index === currentImageIndex
                        ? '0 25px 50px -12px rgba(242, 92, 102, 0.35)'
                        : 'none',
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </motion.div>
              ))}

              {/* Slider Indicators */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {sliderImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-[#B3262E]'
                        : 'w-2 bg-[#E6E6EA]'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[#1F1F1F]/20 rounded-full flex justify-center pt-2">
          <motion.div
            className="w-1 h-3 bg-[#1F1F1F]/40 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
