import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CDN = 'https://res.cloudinary.com/dhhd92sgr';
// g_center for design/branding (centered compositions), g_face for portraits, g_auto for scenes
const img = (v, path, g = 'center') =>
  `${CDN}/image/upload/w_400,h_400,c_fill,g_${g},q_auto,f_auto/${v}/${path}`;
// so_ = seek offset in seconds to pick a good video frame
const vid = (v, path, so = 1, g = 'auto') =>
  `${CDN}/video/upload/so_${so},w_400,h_400,c_fill,g_${g},q_auto,f_jpg/${v}/${path}`;

const MONTAGE = [
  // Identidad Visual — Dulce Cuidado (primera imagen)
  img('v1772046500', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Dulce_Cuidado/1.jpg', 'center'),
  // Audiovisual — FOF Trujillo concierto (3s in, auto subject)
  vid('v1772046474', 'pixelbros/Portfolio/AudioVisual/FOF_Trujillo/1', 3, 'auto'),
  // Social Media — Barbarian Bar Kanagawa (2s in)
  vid('v1772046681', 'pixelbros/Portfolio/Social_Media/Barbarian_Bar/BARBARIAN_KANAGAWA', 2, 'auto'),
  // Identidad Visual — Entrepenauta (primera imagen)
  img('v1772046533', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Entrepenauta/1.jpg', 'center'),
  // Audiovisual — Luxia (2s in, auto)
  vid('v1772046523', 'pixelbros/Portfolio/AudioVisual/Luxia/1', 2, 'auto'),
  // Fotografía — La Vieja Taberna ambiente nocturno
  img('v1772046630', 'pixelbros/Portfolio/Fotografia/LA_VIEJA_TABERNA/DSC03992.jpg', 'auto'),
  // Social Media — GMS Perú Cargamento (2s in)
  vid('v1772046756', 'pixelbros/Portfolio/Social_Media/GMS_Peru/GMS_CARGAMENTO', 2, 'auto'),
  // Identidad Visual — Laboralis (primera imagen)
  img('v1772046534', 'pixelbros/Portfolio/Diseno_de_Identidad_Visual/Laboralis/1.jpg', 'center'),
  // Fotografía — La Vieja Taberna bar shot
  img('v1772046622', 'pixelbros/Portfolio/Fotografia/LA_VIEJA_TABERNA/DSC01410.jpg', 'auto'),
  // Social Media — Barbarian Bar Halloween (4s in)
  vid('v1772046705', 'pixelbros/Portfolio/Social_Media/Barbarian_Bar/BARBARIAN_HALLOWEEN', 4, 'auto'),
];



const SERVICES = ['Identidad Visual', 'Social Media', 'Fotografía', 'Audiovisual', 'Menú Digital'];

const OPEN_EASE  = [0.16, 1, 0.3, 1];
const CLOSE_EASE = [0.55, 0, 0.45, 1];
const PHASE_DUR  = { closed: 2000, opening: 720, open: 2600, closing: 620 };
const PHASE_NEXT = { closed: 'opening', opening: 'open', open: 'closing', closing: 'closed' };

/*  Strobe image  */
const StrobeImg = ({ imgSrc }) => (
  <AnimatePresence mode="wait">
    <motion.img
      key={imgSrc}
      src={imgSrc}
      alt=""
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover object-center"
      initial={{ opacity: 0, filter: 'brightness(2)' }}
      animate={{ opacity: 1,  filter: 'brightness(1)' }}
      exit={{   opacity: 0,  filter: 'brightness(0.15)' }}
      transition={{ duration: 0.07, ease: 'linear' }}
    />
  </AnimatePresence>
);

/*
 * SplitReveal
 *
 * In-flow animated gap approach:
 * - Top word is normal flow
 * - A motion.div gap expands its HEIGHT → pushes bottom word down naturally
 * - Image lives INSIDE that gap div (no z-index fights, always visible)
 * - Bottom word + belowContent follow naturally — no absolute math
 */
const STRIP_H = 220;

const SplitReveal = ({ topNode, bottomNode, belowContent, startDelay = 1.8 }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [phase, setPhase]   = useState('closed');

  useEffect(() => {
    if (!MONTAGE.length) return;
    const t = setInterval(() => setImgIdx(i => (i + 1) % MONTAGE.length), 900);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let timer;
    const tick = (p) => {
      timer = setTimeout(() => {
        const next = PHASE_NEXT[p];
        setPhase(next);
        tick(next);
      }, PHASE_DUR[p]);
    };
    const init = setTimeout(() => tick('closed'), startDelay * 1000);
    return () => { clearTimeout(init); clearTimeout(timer); };
  }, [startDelay]);

  const isOpen   = phase === 'opening' || phase === 'open';
  const inMotion = phase === 'opening' || phase === 'closing';
  const dur      = inMotion ? (phase === 'opening' ? 0.72 : 0.6) : 0;
  const ease     = phase === 'opening' ? OPEN_EASE : CLOSE_EASE;

  return (
    <div className="w-full flex flex-col items-center">
      {/* TOP WORD — normal flow */}
      <div
        className="font-black uppercase text-white text-center leading-none w-full"
        style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}
      >
        {topNode}
      </div>

      {/* ANIMATED GAP — expands in flow, pushing bottom word down */}
      <motion.div
        className="w-full flex justify-center overflow-hidden"
        animate={{ height: isOpen ? STRIP_H : 0 }}
        transition={{ duration: dur, ease }}
        style={{ height: 0 }}
      >
        {/* Image square centred inside the gap */}
        <div
          style={{
            width: STRIP_H,
            height: STRIP_H,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 20px 64px rgba(0,0,0,0.8)',
            flexShrink: 0,
            position: 'relative',
          }}
        >
          {MONTAGE.length > 0 && <StrobeImg imgSrc={MONTAGE[imgIdx]} />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/25 pointer-events-none" />
        </div>
      </motion.div>

      {/* BOTTOM WORD — pushed down naturally by the gap */}
      <div
        className="font-black uppercase text-white text-center leading-none w-full"
        style={{ fontSize: 'clamp(2rem, 5.5vw, 5.5rem)' }}
      >
        {bottomNode}
      </div>

      {/* BELOW CONTENT — follows naturally, no gap ever */}
      {belowContent}
    </div>
  );
};

/* One-shot letter-spacing reveal */
const LSReveal = ({ children, delay = 0, className = '', style = {} }) => (
  <motion.span
    initial={{ opacity: 0, letterSpacing: '0.55em', filter: 'blur(10px)' }}
    animate={{ opacity: 1, letterSpacing: '0.03em', filter: 'blur(0px)' }}
    transition={{ delay, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
    className={className}
    style={style}
  >
    {children}
  </motion.span>
);

const Hero = () => {
  const [svcIdx, setSvcIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSvcIdx(i => (i + 1) % SERVICES.length), 1700);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05061a] flex flex-col items-center justify-center">

      {/* Spotlights */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% -5%, #2d317c 0%, #1a1c52 40%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 10% 100%, #22265a 0%, transparent 55%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 40% at 92% 95%, #1e2050 0%, transparent 55%)' }} />

      {/* PIXELBROS watermark */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute left-0 right-0 text-white/[0.038] font-black select-none whitespace-nowrap leading-none uppercase"
            style={{ top: `${i * 22}%`, fontSize: 'clamp(4rem, 11vw, 9rem)', letterSpacing: '0.06em' }}
            animate={{ x: i % 2 === 0 ? ['0%', '-5%', '0%'] : ['-5%', '0%', '-5%'] }}
            transition={{ duration: 13 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS&nbsp;&nbsp;&nbsp;&nbsp;PIXELBROS
          </motion.div>
        ))}
      </div>

      {/* Micro-dots */}
      <motion.div className="absolute top-1/4 left-[5%] w-1.5 h-1.5 rounded-full bg-[#e73c50]"
        animate={{ y: [-6, 6, -6], opacity: [0.6, 1, 0.6] }} transition={{ duration: 3.5, repeat: Infinity }} />
      <motion.div className="absolute bottom-1/3 right-[7%] w-1 h-1 rounded-full bg-[#474192]/80"
        animate={{ y: [6, -6, 6] }} transition={{ duration: 4.2, repeat: Infinity }} />

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-3xl mx-auto px-6 sm:px-8 text-center pt-24 pb-16">

        {/* MEJORAMOS */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="mb-4"
          style={{ fontSize: 'clamp(0.6rem, 1.4vw, 1rem)' }}
        >
          <LSReveal
            delay={0.15}
            className="text-white/30 font-light uppercase block"
            style={{ letterSpacing: '0.22em' }}
          >
            MEJORAMOS
          </LSReveal>
        </motion.div>

        {/* TU MARCA / CON IMPACTO — split reveal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.6 }}
        >
          <SplitReveal
            startDelay={2.0}
            topNode={
              <span className="inline-flex items-center justify-center gap-x-4 flex-wrap">
                <motion.span
                  initial={{ scale: 0.35, opacity: 0, filter: 'blur(20px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.32, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white inline-block"
                >
                  TU
                </motion.span>
                <motion.span
                  initial={{ scale: 0.3, opacity: 0, filter: 'blur(22px)' }}
                  animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                  transition={{ delay: 0.44, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  className="text-white inline-block"
                >
                  MARCA
                </motion.span>
              </span>
            }
            bottomNode={
              <motion.span
                initial={{ opacity: 0, y: 18, filter: 'blur(14px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.6, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                CON{' '}
                <span className="text-[#e73c50]">IMPACTO</span>
              </motion.span>
            }
            belowContent={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="w-full"
              >
                {/* ASÍ TRABAJAMOS EN [service] */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8 mb-8">
                  <span
                    className="text-white/30 uppercase font-light"
                    style={{ fontSize: 'clamp(0.58rem, 1.1vw, 0.8rem)', letterSpacing: '0.18em' }}
                  >
                    ASÍ TRABAJAMOS EN
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={svcIdx}
                      initial={{ opacity: 0, y: 6, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -6, filter: 'blur(3px)' }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[#e73c50] font-bold uppercase"
                      style={{ fontSize: 'clamp(0.58rem, 1.1vw, 0.8rem)', letterSpacing: '0.18em' }}
                    >
                      {SERVICES[svcIdx]}
                    </motion.span>
                  </AnimatePresence>
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <Link to="/contact">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: '0 16px 40px rgba(231,60,80,0.45)' }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 bg-[#e73c50] text-white font-bold text-sm tracking-wider shadow-xl"
                    >
                      Empieza Ahora
                    </motion.button>
                  </Link>
                  <Link to="/portfolio">
                    <motion.button
                      whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.12)' }}
                      whileTap={{ scale: 0.97 }}
                      className="px-8 py-3.5 bg-white/[0.07] text-white font-semibold text-sm tracking-wider backdrop-blur-sm transition-all"
                    >
                      Ver Portfolio
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            }
          />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/25 text-[9px] uppercase tracking-[0.25em] font-semibold">Scroll</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-white/35 to-transparent"
          style={{ originY: 0 }}
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
};

export default Hero;
