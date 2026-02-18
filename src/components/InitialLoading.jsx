import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LogoIcon from '../images/LogoIconPixel.png';

const InitialLoading = ({ onComplete }) => {
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    document.body.dataset.loading = 'true';
    // Duración de la animación antes de iniciar transición
    const timer = setTimeout(() => {
      setIsMounted(false);
    }, 2800);

    return () => {
      clearTimeout(timer);
      delete document.body.dataset.loading;
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isMounted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#464394]"
        >
          {/* Persianas verticales tipo acordeon */}
          <div className="absolute inset-0 flex">
            {[...Array(10)].map((_, index) => (
              <motion.div
                key={index}
                className="flex-1 bg-[#F46A73]"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{
                  duration: 1,
                  delay: index * 0.06,
                  ease: [0.65, 0, 0.35, 1],
                }}
                style={{ transformOrigin: 'right' }}
              />
            ))}
          </div>

          {/* Logo centrado */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 1.1,
              opacity: 0,
            }}
            transition={{
              duration: 0.8,
              exit: { duration: 0.6 }
            }}
            className="relative z-10"
          >
            <motion.img
              src={LogoIcon}
              alt="PixelBros"
              className="w-32 h-32 md:w-40 md:h-40"
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                rotate: {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
                scale: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
              style={{ filter: 'drop-shadow(0 0 18px rgba(122, 22, 32, 0.45))' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoading;
