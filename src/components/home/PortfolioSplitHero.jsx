import { useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { getPortfolioAssets } from '../../config/assets.js';

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

/**
 * Returns one image URL per project (the first non-video asset found).
 * Groups by the category/project pair so every distinct project contributes one cover.
 */
const extractCovers = (assets) => {
  const seen = new Set();
  const covers = [];
  // Sort keys so ordering is deterministic
  const keys = Object.keys(assets).sort();
  for (const path of keys) {
    const src = assets[path];
    if (isVideoSrc(src)) continue;
    const normalized = path.replace(/\\/g, '/');
    // Match /Portfolio/<category>/<project>/...
    const match = normalized.match(/\/Portfolio\/([^/]+)\/([^/]+)\//);
    if (!match) continue;
    const key = `${match[1]}/${match[2]}`;
    if (!seen.has(key)) {
      seen.add(key);
      covers.push(src);
    }
  }
  return covers;
};

const BG   = '#06071a';
const MASK = `linear-gradient(to %DIR%, ${BG} 0%, transparent 100%)`;

const PortfolioSplitHero = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const assets = getPortfolioAssets();

  const covers = useMemo(() => {
    const raw = extractCovers(assets);
    if (raw.length === 0) return [];
    // Ensure ≥ 10 items so the loop looks full
    const padded = [...raw];
    while (padded.length < 10) padded.push(...raw);
    return padded.slice(0, 14);
  }, [assets]);

  // Double the list → seamless loop: animation goes from 0 to -50%
  const track = [...covers, ...covers];

  const textStyle = {
    fontSize: 'clamp(3.2rem, 10.5vw, 13.5rem)',
    letterSpacing: '-0.04em',
  };

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: BG,
        height: '88vh',
        minHeight: '540px',
        maxHeight: '940px',
      }}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
    >
      {/* separator top */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* fade masks to blend images into bg */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 z-10"
        style={{ background: MASK.replace('%DIR%', 'bottom') }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-10"
        style={{ background: MASK.replace('%DIR%', 'top') }} />

      {/* label */}
      <motion.p
        className="absolute top-8 left-1/2 -translate-x-1/2 z-20
          text-[9px] font-bold uppercase tracking-[0.28em] text-[#5ab3e5]"
        initial={{ opacity: 0, y: -10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        
      </motion.p>

      {/* ── Main layout ── */}
      <div className="h-full flex items-center">

        {/* LEFT — PIXEL */}
        <div className="flex-1 flex items-center justify-end pr-6 sm:pr-10 lg:pr-16 overflow-hidden">
          <motion.span
            className="text-white font-black select-none leading-[0.9] whitespace-nowrap"
            style={textStyle}
            initial={{ x: -100, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 1.05, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            PIXEL
          </motion.span>
        </div>

        {/* CENTER — scrolling image strip */}
        <motion.div
          className="flex-shrink-0 relative"
          style={{
            width: 'clamp(120px, 14vw, 220px)',
            height: '100%',
            overflow: 'hidden',
          }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {covers.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                animation: 'pbScrollUp 28s linear infinite',
                willChange: 'transform',
              }}
            >
              {track.map((src, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: '100%',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    aspectRatio: i % 5 === 0 ? '1/1' : i % 5 === 2 ? '4/5' : '3/4',
                    position: 'relative',
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      filter: 'saturate(0.7) brightness(0.82)',
                    }}
                    loading="lazy"
                    draggable={false}
                  />
                  {/* subtle blue-brand tint overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, rgba(71,65,146,0.18) 0%, rgba(6,7,26,0.22) 100%)',
                    borderRadius: '10px',
                  }} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flexShrink: 0,
                    width: '100%',
                    aspectRatio: '3/4',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.05)',
                  }}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* RIGHT — BROS */}
        <div className="flex-1 flex items-center justify-start pl-6 sm:pl-10 lg:pl-16 overflow-hidden">
          <div className="flex flex-col items-start gap-6">
            <motion.span
              className="text-white font-black select-none leading-[0.9] whitespace-nowrap"
              style={textStyle}
              initial={{ x: 100, opacity: 0 }}
              animate={inView ? { x: 0, opacity: 1 } : {}}
              transition={{ duration: 1.05, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              BROS
            </motion.span>

            {/* Subtle CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.8 }}
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-3
                  text-white/25 hover:text-white
                  transition-colors duration-400"
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.3em]"
                  style={{ letterSpacing: '0.28em' }}
                >
                  Ver portafolio
                </span>
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-full
                    border border-white/15 group-hover:border-white/50
                    transition-all duration-400"
                >
                  <svg width="10" height="10" viewBox="0 0 20 20" fill="none" aria-hidden="true"
                    className="translate-x-0 group-hover:translate-x-[2px] transition-transform duration-300"
                  >
                    <path d="M4 10h12m0 0l-4-4m4 4l-4 4"
                      stroke="currentColor" strokeWidth="2.5"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

      </div>

      {/* separator bottom */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </motion.section>
  );
};

export default PortfolioSplitHero;
