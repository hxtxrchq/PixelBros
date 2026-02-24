import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import LogoIcon from '../images/LogoIconPixel.png';

const LoadingScreen = ({ isLoading, onLoadingComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    'Cargando proyectos...',
    'Organizando experiencias digitales...',
    'Compilando creatividad...',
    'Preparando inspiración...',
  ];

  const currentText = texts[Math.floor(textIndex / 30) % texts.length];

  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      setTextIndex((prev) => prev + 1);
      if (textIndex > 120) {
        onLoadingComplete();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [textIndex, isLoading, onLoadingComplete]);

  useEffect(() => {
    // Typing effect
    if (currentText) {
      const typingSpeed = 50;
      const interval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length < currentText.length) {
            return currentText.slice(0, prev.length + 1);
          } else {
            return currentText;
          }
        });
      }, typingSpeed);
      return () => clearInterval(interval);
    }
  }, [currentText]);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-[#1a1c52] z-50 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Logo Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
          className="mb-12"
        >
          <motion.img
            src={LogoIcon}
            alt="PixelBros"
            className="w-32 h-32 mx-auto"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        </motion.div>

        {/* Loading Text with Typewriter Effect */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {displayedText}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-[#B3262E]"
            >
              |
            </motion.span>
          </h2>
          <p className="text-white/70 text-lg">
            Estamos preparando lo mejor para ti
          </p>
        </motion.div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B3262E] to-[#F25C66]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 4, ease: 'easeInOut' }}
            style={{ originX: 0 }}
          />
        </div>

        {/* Floating Elements */}
        <div className="mt-16 flex justify-center gap-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-[#B3262E]"
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
