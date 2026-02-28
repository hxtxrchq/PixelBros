import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const T_TRACE  =  300;
const T_FILL   = 1700;
const T_TOTAL  = 3100;

const LOGO_PATH =
  'M 1570 2830 l0 -1270 1275 0 1275 0 0 200 0 200 -652 0 ' +
  'c-389 0 -648 4 -643 9 9 8 156 70 898 377 158 65 287 123 287 129 ' +
  '0 5 -33 90 -72 188 -64 156 -75 177 -93 173 -11 -2 -117 -44 -235 -94 ' +
  '-295 -123 -922 -383 -940 -389 -8 -3 192 202 445 456 l460 461 ' +
  '-145 145 -145 145 -458 -457 c-279 -278 -456 -448 -452 -433 ' +
  '7 23 133 328 381 924 57 137 103 251 101 253 -9 8 -370 153 -374 149 ' +
  '-4 -4 -113 -263 -246 -586 -160 -388 -238 -573 -246 -588 ' +
  '-7 -11 -10 197 -11 631 l0 647 -205 0 -205 0 0 -1270z';

const NeonDefs = () => (
  <defs>
    <filter id="neon" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="12"  result="b1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="28"  result="b2" />
      <feColorMatrix in="b1" type="matrix"
        values="1 0 0 0 0.9  0 0 0 0 0.15  0 0 0 0 0.18  0 0 0 1.4 0" result="r1" />
      <feColorMatrix in="b2" type="matrix"
        values="1 0 0 0 0.9  0 0 0 0 0.15  0 0 0 0 0.18  0 0 0 0.8 0" result="r2" />
      <feMerge>
        <feMergeNode in="r2" />
        <feMergeNode in="r1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
  </defs>
);

const InitialLoading = ({ onComplete }) => {
  const [isMounted, setIsMounted] = useState(true);
  const [showFill,  setShowFill]  = useState(false);

  useEffect(() => {
    document.body.dataset.loading = 'true';
    const t1 = setTimeout(() => setShowFill(true),   T_FILL);
    const t3 = setTimeout(() => setIsMounted(false), T_TOTAL);

    return () => {
      clearTimeout(t1); clearTimeout(t3);
      delete document.body.dataset.loading;
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isMounted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.55, 0, 0.45, 1] }}
          className="fixed inset-0 z-[9999] bg-[#05061a] flex flex-col items-center justify-center overflow-hidden select-none"
        >
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            style={{ background: 'radial-gradient(ellipse 55% 50% at 50% 50%, rgba(231,60,80,0.18) 0%, transparent 65%)' }}
          />

          <div className="relative flex items-center justify-center" style={{ width: 190, height: 190 }}>
            <motion.svg
              viewBox="0 0 567 567"
              width="190"
              height="190"
              className="absolute inset-0"
              style={{ overflow: 'visible', zIndex: 1 }}
            >
              <NeonDefs />
              <g transform="translate(0,567) scale(0.1,-0.1)">
                <motion.path
                  d={LOGO_PATH}
                  stroke="none"
                  initial={{ opacity: 0 }}
                  animate={{ fill: '#e73c50', opacity: showFill ? [0, 0.22, 0.1] : 0 }}
                  transition={{ duration: 0.9, times: [0, 0.2, 1] }}
                />
                <motion.path
                  d={LOGO_PATH}
                  fill="none"
                  stroke="#e73c50"
                  strokeWidth={55}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#neon)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: T_TRACE / 1000, duration: 1.35, ease: [0.4, 0, 0.25, 1] },
                    opacity:    { delay: T_TRACE / 1000, duration: 0.01 },
                  }}
                />
                <motion.path
                  d={LOGO_PATH}
                  fill="none"
                  stroke="rgba(255,160,160,0.9)"
                  strokeWidth={18}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#glow-soft)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { delay: T_TRACE / 1000 + 0.05, duration: 1.3, ease: [0.4, 0, 0.25, 1] },
                    opacity:    { delay: T_TRACE / 1000 + 0.05, duration: 0.01 },
                  }}
                />
              </g>
            </motion.svg>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="font-black uppercase text-white mt-5"
            style={{ fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)', letterSpacing: '0.22em' }}
          >
            PIXEL<span style={{ color: '#e73c50' }}>BROS</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="uppercase font-light text-white/20 mt-1"
            style={{ fontSize: '0.47rem', letterSpacing: '0.36em' }}
          >
           
          </motion.p>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InitialLoading;