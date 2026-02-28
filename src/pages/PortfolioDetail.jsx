import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPortfolioAssets } from '../config/assets.js';

const normalizeName = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const slugify = (value) => normalizeName(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

const getFileOrder = (fileName) => {
  const match = fileName.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
};

const buildPortfolioIndex = (assets) => {
  const categoriesMap = new Map();

  Object.entries(assets).forEach(([rawPath, src]) => {
    const path = rawPath.replace(/\\/g, '/');
    const match = path.match(/\/Portfolio\/([^/]+)\/([^/]+)\/(.+)$/);
    if (!match) return;

    const [, categoryName, projectName, rest] = match;
    const restParts = rest.split('/');
    const fileName = restParts[restParts.length - 1];
    const subprojectName = restParts.length > 1 ? restParts[0] : null;

    const extMatch = fileName.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : '';
    const type = ['mp4', 'webm'].includes(ext) ? 'video' : 'image';
    const order = getFileOrder(fileName);
    const nameKey = fileName.toLowerCase();

    const categorySlug = slugify(categoryName);
    const projectSlug = slugify(projectName);
    const slug = `${categorySlug}-${projectSlug}`;

    if (!categoriesMap.has(categorySlug)) {
      categoriesMap.set(categorySlug, {
        id: categorySlug,
        name: categoryName,
        projects: new Map(),
      });
    }

    const category = categoriesMap.get(categorySlug);
    if (!category.projects.has(slug)) {
      category.projects.set(slug, {
        slug,
        title: projectName,
        categoryId: categorySlug,
        categoryName,
        groups: new Map(),
      });
    }

    const project = category.projects.get(slug);
    const groupKey = subprojectName ? slugify(subprojectName) : 'default';
    if (!project.groups.has(groupKey)) {
      project.groups.set(groupKey, {
        name: subprojectName || 'Galeria',
        id: groupKey,
        items: [],
      });
    }

    project.groups.get(groupKey).items.push({
      id: `${slug}-${groupKey}-${nameKey}`,
      src,
      type,
      order,
      nameKey,
      alt: `${projectName} ${fileName}`,
    });
  });

  const categories = Array.from(categoriesMap.values())
    .map((category) => {
      const projects = Array.from(category.projects.values())
        .map((project) => {
          const groups = Array.from(project.groups.values())
            .map((group) => ({
              ...group,
              items: group.items
                .sort((a, b) => a.order - b.order || a.nameKey.localeCompare(b.nameKey))
                .map((item, index) => ({
                  id: index + 1,
                  src: item.src,
                  type: item.type,
                  alt: item.alt,
                })),
            }))
            .sort((a, b) => a.name.localeCompare(b.name));

          const cover = groups[0]?.items?.[0] || null;

          return {
            ...project,
            groups,
            items: groups.length === 1 ? groups[0].items : null,
            coverSrc: cover?.src || null,
          };
        })
        .sort((a, b) => a.title.localeCompare(b.title));

      return { ...category, projects };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const projects = categories.flatMap((category) => category.projects);
  const projectsBySlug = projects.reduce((acc, project) => {
    acc[project.slug] = project;
    return acc;
  }, {});

  return { categories, projects, projectsBySlug };
};

const isVideoSrc = (src) =>
  typeof src === 'string' && /\.(mp4|webm)$/i.test(src);

// Derive a Cloudinary poster thumbnail URL from a video src
const derivePoster = (src) => {
  if (!src || !isVideoSrc(src)) return undefined;
  return src
    .replace('/video/upload/', '/video/upload/so_0,q_auto,f_jpg/')
    .replace(/\.(mp4|webm)$/i, '.jpg');
};

// ── Card Deck ──────────────────────────────────────────────────────────────
// Design tokens
const CARD_W      = 340;    // max card width (px)
const CARD_RATIO  = 4 / 5;  // width/height portrait — change to 16/9 for landscape
const CARD_H      = Math.round(CARD_W / CARD_RATIO); // ≈ 425
const CARD_RADIUS = 20;

// ── Card face: object-cover with subtle blurred bg padding for odd ratios ──
const CardFace = ({ item, active }) => {
  const isVid  = item?.type === 'video';
  const src    = item?.src;
  const poster = isVid ? derivePoster(src) : undefined;
  const media  = (cls, extra = {}) =>
    isVid
      ? <video src={src} muted playsInline preload="metadata" poster={poster}
          className={cls} style={extra} />
      : <img   src={src} alt={item?.alt ?? ''} draggable={false} loading="lazy"
          className={cls} style={extra} />;
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: CARD_RADIUS }}>
      {/* Blurred ambient bg — fills letterbox gaps */}
      {media('absolute inset-0 w-full h-full object-cover scale-110',
        { filter: 'blur(22px)', opacity: 0.45 })}
      {/* Sharp main layer — contain so full image/video is always visible */}
      {media('relative z-10 w-full h-full object-contain')}
      {/* Active gradient overlay — subtle vignette */}
      {active && (
        <div className="absolute inset-0 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(6,7,26,0.32) 0%, transparent 50%)' }} />
      )}
    </div>
  );
};

// ── Auto-cycle + gesture deck ────────────────────────────────────────────────
// Timing
const FAN_GAP  = 88;   // px between fanned cards vertically
const CYCLE_MS = 950;  // ms per card in auto-cycle
const FAN_MS   = 580;  // ms for fan-out animation

const CardDeck = ({ items, onCardClick }) => {
  const n = items.length;

  // ── Phase machine: 'stack' → 'fan' → 'cycle' → 'gather' → repeat ──────
  const [phase,     setPhase]     = useState('stack');
  const [activeIdx, setActiveIdx] = useState(0);
  const [pulse,     setPulse]     = useState(false); // scale-up on gather
  const [drag,      setDrag]      = useState(false); // cursor grab indicator

  const timers     = useRef([]);
  const manual     = useRef(false); // user took control → pause auto
  const dragOrigin = useRef(null);
  const wheelLock  = useRef(false);
  const stageRef   = useRef(null);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const sched    = (fn, ms) => { const id = setTimeout(fn, ms); timers.current.push(id); };

  // ── Auto sequence ────────────────────────────────────────────────────────
  const runSequence = useCallback(() => {
    if (manual.current) return;
    setPhase('stack');
    setActiveIdx(0);
    sched(() => {
      if (manual.current) return;
      setPhase('fan');
      sched(() => { if (!manual.current) setPhase('cycle'); }, FAN_MS + 260);
    }, 540);
  }, []); // eslint-disable-line

  // Restart when items change (new project group)
  useEffect(() => {
    clearAll();
    manual.current = false;
    runSequence();
    return clearAll;
  }, [items]); // eslint-disable-line

  // Auto-cycle interval — runs only during 'cycle' phase
  useEffect(() => {
    if (phase !== 'cycle' || manual.current || n < 2) return;
    const id = setInterval(() => {
      if (manual.current) { clearInterval(id); return; }
      setActiveIdx(prev => {
        const next = (prev + 1) % n;
        if (next === 0) {
          // Completed full loop → gather → zoom → restart
          clearAll();
          sched(() => {
            setPhase('gather');
            setPulse(true);
            sched(() => setPulse(false), 380);
            sched(() => { if (!manual.current) runSequence(); }, 860);
          }, Math.round(CYCLE_MS * 0.35));
        }
        return next;
      });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [phase, n]); // eslint-disable-line

  // ── Manual navigation (pauses auto-cycle) ──────────────────────────────
  const go = useCallback((d) => {
    manual.current = true;
    clearAll();
    setPhase('fan');
    setActiveIdx(prev => ((prev + d) % n + n) % n);
  }, [n]); // eslint-disable-line

  // ── Keyboard ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); go(1);  }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [go]);

  // ── Scroll wheel (debounced) ─────────────────────────────────────────────
  useEffect(() => {
    const el = stageRef.current;
    if (!el || n < 2) return;
    const onWheel = (e) => {
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      go(e.deltaY > 0 ? 1 : -1);
      setTimeout(() => { wheelLock.current = false; }, 440);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go, n]);

  // ── Mouse drag ──────────────────────────────────────────────────────────
  const onMouseDown = (e) => {
    if (n < 2) return;
    dragOrigin.current = { x: e.clientX, time: Date.now() };
    setDrag(true);
  };
  const onMouseUp = (e) => {
    setDrag(false);
    if (!dragOrigin.current) return;
    const dx   = e.clientX - dragOrigin.current.x;
    const dt   = Date.now() - dragOrigin.current.time;
    const flick = dt < 320 && Math.abs(dx) > 18;
    if (flick || Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
    dragOrigin.current = null;
  };
  const onMouseLeave = () => { setDrag(false); dragOrigin.current = null; };

  // ── Touch swipe ─────────────────────────────────────────────────────────
  const onTouchStart = (e) => {
    dragOrigin.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!dragOrigin.current) return;
    const dx = e.changedTouches[0].clientX - dragOrigin.current.x;
    const dy = e.changedTouches[0].clientY - dragOrigin.current.y;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 34) go(dx < 0 ? 1 : -1);
    dragOrigin.current = null;
  };

  // ── Derived state ────────────────────────────────────────────────────────
  const stacked = phase === 'stack' || phase === 'gather';

  return (
    <div className="relative flex flex-col items-center w-full select-none">

      {/* ── Stage ────────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="relative flex items-center justify-center w-full"
        style={{
          height:      CARD_H + FAN_GAP * 4 + 32,
          touchAction: 'pan-y',
          cursor:      n > 1 ? (drag ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {items.map((item, i) => {
          // Compute signed offset relative to active card (wraps around)
          let off = i - activeIdx;
          const half = Math.floor(n / 2);
          if (off >  half) off -= n;
          if (off < -half) off += n;
          const abs       = Math.abs(off);
          if (abs > 3) return null;
          const isActive  = off === 0;

          // ── Per-phase animation targets ──────────────────────────────── 
          let targetY, targetScale, targetOpacity, targetRotate, targetBlur;
          if (stacked) {
            // Stack: all cards piled in center, slight depth
            targetY       = 0;
            targetScale   = pulse && isActive ? 1.065 : (1 - abs * 0.022);
            targetOpacity = 1 - abs * 0.10;
            targetRotate  = 0;
            targetBlur    = 0;
          } else {
            // Fanned: escalator steps, active card on top
            targetY       = off * FAN_GAP;
            targetScale   = isActive ? 1 : (1 - abs * 0.082);
            targetOpacity = isActive ? 1 : Math.max(0.18, 1 - abs * 0.30);
            targetRotate  = off * 1.8;  // micro-parallax tilt
            targetBlur    = isActive ? 0 : abs * 1.4;
          }

          return (
            <motion.div
              key={item.id ?? i}
              animate={{
                y:       targetY,
                scale:   targetScale,
                opacity: targetOpacity,
                rotate:  targetRotate,
                filter:  `blur(${targetBlur}px)`,
              }}
              transition={{
                type:      'spring',
                stiffness: 230,
                damping:   26,
                mass:      0.88,
                delay:     stacked ? 0 : abs * 0.045, // stagger on fan-out
              }}
              onClick={() => {
                if (dragOrigin.current) return;      // was drag, not tap
                if (isActive) onCardClick?.(item);
                else go(off > 0 ? 1 : -1);
              }}
              style={{
                position:     'absolute',
                zIndex:       20 - abs,
                width:        '100%',
                maxWidth:     CARD_W,
                height:       CARD_H,
                borderRadius: CARD_RADIUS,
                overflow:     'hidden',
                background:   '#0b0c1e',
                boxShadow:    isActive && !stacked
                  ? '0 26px 56px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.06)'
                  : '0 8px 22px rgba(0,0,0,0.38)',
                willChange:   'transform, opacity, filter',
                cursor:       isActive && !drag ? 'zoom-in' : (n > 1 ? (drag ? 'grabbing' : 'grab') : 'default'),
              }}
            >
              <CardFace item={item} active={isActive} />

              {/* Depth tint — inactive cards only */}
              {!isActive && (
                <div className="absolute inset-0 z-30 pointer-events-none"
                  style={{
                    background: `rgba(6,7,26,${stacked ? 0.10 : Math.min(0.52, abs * 0.20)})`,
                    borderRadius: CARD_RADIUS,
                  }} />
              )}

              {/* Video badge — active card */}
              {item.type === 'video' && isActive && (
                <div className="absolute inset-0 z-40 flex items-end justify-start p-4 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(10,10,22,0.58)', backdropFilter: 'blur(10px)',
                             border: '1px solid rgba(255,255,255,0.12)' }}>
                    <svg width="9" height="10" fill="#e73c50" viewBox="0 0 9 10">
                      <path d="M0 .5v9l9-4.5L0 .5z"/>
                    </svg>
                    <span className="text-[9px] font-medium tracking-widest uppercase"
                      style={{ color: 'rgba(255,255,255,0.7)' }}>Video</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Hot zones — invisible click areas, hover-hint only */}
        {n > 1 && <>
          <HotZone dir="prev" onClick={() => go(-1)} />
          <HotZone dir="next" onClick={() => go(1)}  />
        </>}
      </div>

      {/* ── Indicators ───────────────────────────────────────────────────── */}
      {n > 1 && (
        <div className="flex items-center gap-3 mt-4 w-full justify-center" style={{ maxWidth: CARD_W }}>

          {/* Micro-dots — pill for active, tiny dot for rest; clickable */}
          <div className="flex items-center gap-[6px]">
            {items.map((_, i) => (
              <motion.div key={i}
                animate={{ width: i === activeIdx ? 16 : 4, opacity: i === activeIdx ? 1 : 0.22 }}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                onClick={() => { manual.current = true; clearAll(); setPhase('fan'); setActiveIdx(i); }}
                style={{
                  height: 4, borderRadius: 99, flexShrink: 0, cursor: 'pointer',
                  background: i === activeIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.38)',
                }}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="shrink-0 tabular-nums font-mono"
            style={{ fontSize: 9, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.28)' }}>
            {String(activeIdx + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(n).padStart(2, '0')}
          </span>
        </div>
      )}
    </div>
  );
};

// ── Hot zone — invisible nav area with hover hint ────────────────────────────
const HotZone = ({ dir, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const isPrev = dir === 'prev';
  return (
    <div
      className="absolute inset-y-0 z-50 flex items-center"
      style={{
        [isPrev ? 'left' : 'right']: 0,
        width: '12%',
        cursor: 'pointer',
        [isPrev ? 'paddingLeft' : 'paddingRight']: 4,
        justifyContent: isPrev ? 'flex-start' : 'flex-end',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : (isPrev ? -4 : 4) }}
        transition={{ duration: 0.18 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
      >
        {/* Thin chevron */}
        <svg width="10" height="18" viewBox="0 0 10 18" fill="none"
          stroke="rgba(255,255,255,0.55)" strokeWidth="1.4"
          strokeLinecap="round" strokeLinejoin="round">
          {isPrev
            ? <polyline points="8,1 1,9 8,17" />
            : <polyline points="2,1 9,9 2,17" />}
        </svg>
        {/* Tiny label */}
        <span style={{ fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
          {isPrev ? 'Prev' : 'Next'}
        </span>
      </motion.div>
    </div>
  );
};

const PortfolioDetail = () => {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(null);

  const portfolioAssets = getPortfolioAssets();

  const portfolioIndex = useMemo(
    () => buildPortfolioIndex(portfolioAssets),
    [portfolioAssets]
  );

  const project = portfolioIndex.projectsBySlug[slug] || portfolioIndex.projects[0];
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  useEffect(() => {
    setActiveGroupIndex(0);
  }, [project?.slug]);


  const activeItems = useMemo(
    () => project?.groups?.length
      ? project.groups[activeGroupIndex]?.items || []
      : project?.items || [],
    [project, activeGroupIndex]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero Section - 2 Columnas Editorial */}
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-[#e73c50] hover:text-[#e73c50]/70 transition-colors font-medium text-sm uppercase tracking-wide"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M13 8H3m0 0l4 4m-4-4l4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>← Volver</span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            {/* Category + title */}
            <p className="text-sm uppercase tracking-widest text-[#e73c50] mb-2 text-center">
              {project.categoryName}
            </p>
            <h1 className="text-3xl lg:text-5xl font-display font-bold tracking-tight mb-10 text-white text-center">
              {project.title}
            </h1>

            {/* Interactive card deck */}
            <div className="w-full" style={{ maxWidth: 440 }}>
              <CardDeck
                items={activeItems}
                onCardClick={(item) => setActiveImage(item)}
              />
            </div>

            {/* Group tabs (only when project has multiple collections) */}
            {project.groups?.length > 1 && (
              <div className="flex flex-wrap gap-2 justify-center mt-10">
                {project.groups.map((group, index) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupIndex(index)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      index === activeGroupIndex
                        ? 'bg-[#e73c50] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/15'
                    }`}
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            )}

          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            onClick={() => setActiveImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl h-[70vh] rounded-2xl overflow-hidden bg-[#0d0e24]"
              onClick={(event) => event.stopPropagation()}
            >
              {activeImage.src ? (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d0e24] p-6">
                  {activeImage.type === 'video' ? (
                    <video
                      src={activeImage.src}
                      className="max-h-full max-w-full object-contain"
                      preload="metadata"
                      controls
                      playsInline
                    />
                  ) : (
                    <img
                      src={activeImage.src}
                      alt={activeImage.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
              ) : (
                <div className={`absolute inset-0 bg-gradient-to-br ${activeImage.gradient}`} />
              )}
              {!activeImage.src && <div className="absolute inset-0 bg-black/5" />}
              <button
                type="button"
                onClick={() => setActiveImage(null)}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Projects */}
      <section className="py-20 lg:py-32 bg-transparent border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-display font-bold text-center mb-6 text-white"
            >
              Otros <span className="text-[#e73c50]">Proyectos</span>
            </motion.h2>
            <p className="text-lg text-white/65 max-w-2xl mx-auto">
              Explora más casos de éxito y cómo transformamos marcas en la industria
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioIndex.projects
              .filter((proj) => proj.slug !== project.slug)
              .slice(0, 3)
              .map((proj, index) => (
                <motion.div
                  key={proj.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link to={`/portfolio/${proj.slug}`}>
                    <div className="group relative h-[320px] lg:h-[360px] rounded-2xl overflow-hidden transition-all duration-300 bg-[#0d0e24]">
                      {proj.coverSrc ? (
                        <div className="absolute inset-0">
                          {isVideoSrc(proj.coverSrc) ? (
                            <video
                              src={proj.coverSrc}
                              className="h-full w-full object-cover"
                              preload="metadata"
                              muted
                              playsInline
                            />
                          ) : (
                            <div
                              className="absolute inset-0 bg-cover bg-center"
                              style={{ backgroundImage: `url("${proj.coverSrc}")` }}
                            />
                          )}
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1c52] to-[#0d0e24]">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-2xl border border-white/10 bg-white/5 shadow-sm flex items-center justify-center">
                              <span className="text-xl font-display font-bold text-[#B3262E]">
                                {proj.title?.charAt(0) || 'P'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/45 transition-all duration-300" />

                      <div className="absolute inset-0 flex items-end p-6">
                        <div className="translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <p className="text-xs uppercase tracking-widest text-white/80 mb-2">{proj.categoryName}</p>
                          <h3 className="text-2xl font-display font-bold text-white">
                            {proj.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Now After Related Projects */}
      <section className="py-20 lg:py-32 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6 text-white">
              ¿Te gustaría lograr <span className="text-[#e73c50]">resultados similares</span>?
            </h2>
            <p className="text-lg text-white/65 mb-10 leading-relaxed">
              Nuestro equipo está listo para transformar tu negocio. Contáctanos para explorar cómo podemos ayudarte a alcanzar tus objetivos.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(179, 38, 46, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-4 bg-[#e73c50] text-white font-bold rounded-full text-lg shadow-md transition-all duration-300 inline-block"
              >
                Iniciar Proyecto
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default PortfolioDetail;


