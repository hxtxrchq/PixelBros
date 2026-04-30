import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import SvgIcon from '../components/SvgIcon';

const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp', 'avif'];
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'm4v'];

const hasFileExtension = (value = '') => /\.[a-z0-9]+$/i.test(value);

const buildAssetCandidates = (basePath, extensions) => {
  if (!basePath) return [];

  if (hasFileExtension(basePath)) {
    const normalized = basePath.replace(/\.[a-z0-9]+$/i, '');
    const ext = basePath.split('.').pop()?.toLowerCase();
    const alternatives = extensions
      .filter((candidate) => candidate !== ext)
      .map((candidate) => `${normalized}.${candidate}`);
    return [basePath, ...alternatives];
  }

  return extensions.map((ext) => `${basePath}.${ext}`);
};

const optimizeCloudinaryImage = (url, width = 1400) => {
  if (!url || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const resolveHeroMedia = (media, width = 1400) => {
  if (!media?.src) return '';
  if (media.type === 'video') {
    return {
      type: 'video',
      sources: buildAssetCandidates(media.src, VIDEO_EXTENSIONS),
      src: media.src,
    };
  }

  const optimized = optimizeCloudinaryImage(media.src, width);
  return {
    type: 'image',
    sources: buildAssetCandidates(optimized, IMAGE_EXTENSIONS),
    src: optimized,
  };
};

const HERO_LOOP_MEDIA = [
  { type: 'video', src: '/services/hero/video-1' },
  { type: 'image', src: '/services/hero/recurso-1' },
  { type: 'image', src: '/services/hero/recurso-2' },
  { type: 'video', src: '/services/hero/video-2' },
  { type: 'image', src: '/services/hero/recurso-3' },
  { type: 'image', src: '/services/hero/recurso-4' },
];

const SERVICES = [
  {
    id: 1,
    title: 'BRANDING',
    slug: 'identidad-visual',
    cardImage: '/services/cards/branding',
  },
  {
    id: 2,
    title: 'ESTRATEGIA COMERCIAL',
    slug: 'asesoramiento-comercial',
    cardImage: '/services/cards/estrategia-comercial',
  },
  {
    id: 3,
    title: 'PUBLICIDAD DIGITAL',
    slug: 'campanas-publicitarias',
    cardImage: '/services/cards/publicidad-digital',
  },
  {
    id: 4,
    title: 'FOTOGRAFIA PROFESIONAL',
    slug: 'fotografia-profesional',
    cardImage: '/services/cards/fotografia-profesional',
  },
  {
    id: 5,
    title: 'CONTENIDO PARA REDES',
    slug: 'contenidos',
    cardImage: '/services/cards/contenido-para-redes',
  },
  {
    id: 6,
    title: 'PRODUCCION AUDIOVISUAL',
    slug: 'produccion-audiovisual',
    cardImage: '/services/cards/produccion-audiovisual',
  },
  {
    id: 7,
    title: 'ACTIVACIONES BTL',
    slug: 'activaciones-btl',
    cardImage: '/services/cards/activaciones-btl',
  },
];

const Services = () => {
  const cardsViewportRef = useRef(null);

  const heroLoopItems = useMemo(
    () =>
      HERO_LOOP_MEDIA.map((item, index) => ({
        key: `${item.src}-${index}`,
        ...resolveHeroMedia(item, 1000),
      })).filter((item) => Boolean(item.src)),
    []
  );

  const heroTrackItems = useMemo(() => [...heroLoopItems, ...heroLoopItems], [heroLoopItems]);

  const moveCardsNext = () => {
    const viewport = cardsViewportRef.current;
    if (!viewport) return;

    const maxScroll = viewport.scrollWidth - viewport.clientWidth;
    const track = viewport.firstElementChild;
    const firstCard = track?.querySelector('[data-service-card="true"]');
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 270;
    const trackStyles = track ? window.getComputedStyle(track) : null;
    const gap = trackStyles ? parseFloat(trackStyles.columnGap || trackStyles.gap || '20') : 20;
    const step = Math.max(220, Math.floor(cardWidth + gap));
    const next = viewport.scrollLeft + step;

    viewport.scrollTo({
      left: next >= maxScroll - 4 ? 0 : next,
      behavior: 'smooth',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72 }}
          className="relative mb-14 h-[320px] sm:h-[360px] lg:h-[390px] overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
            }}
          >
            <div className="h-full overflow-hidden no-scrollbar">
              <motion.div
                className="flex h-full items-center gap-40 w-max px-2"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              >
                {heroTrackItems.map((item, idx) => (
                  <div
                    key={`hero-${item.key}-${idx}`}
                    className="h-[190px] w-[190px] sm:h-[224px] sm:w-[224px] lg:h-[238px] lg:w-[238px] shrink-0 overflow-hidden rounded-[10px] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
                  >
                    {item.type === 'video' ? (
                      <video
                        className="h-full w-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                      >
                        {(item.sources || []).map((source) => (
                          <source key={source} src={source} />
                        ))}
                      </video>
                    ) : (
                      <img
                        src={item.sources?.[0] || item.src}
                        alt={idx < heroLoopItems.length ? 'Muestra de servicio' : ''}
                        className="h-full w-full object-cover"
                        loading="eager"
                        fetchPriority={idx < 3 ? 'high' : 'auto'}
                        decoding="async"
                        data-candidates={(item.sources || []).join('|')}
                        data-current-index="0"
                        onError={(event) => {
                          const candidates = (event.currentTarget.dataset.candidates || '').split('|').filter(Boolean);
                          const currentIndex = Number(event.currentTarget.dataset.currentIndex || '0');
                          const nextIndex = currentIndex + 1;

                          if (nextIndex < candidates.length) {
                            event.currentTarget.dataset.currentIndex = String(nextIndex);
                            event.currentTarget.src = candidates[nextIndex];
                            return;
                          }

                          event.currentTarget.style.opacity = '0';
                        }}
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,26,0.84)_0%,rgba(6,7,26,0.56)_42%,rgba(6,7,26,0.64)_58%,rgba(6,7,26,0.9)_100%)]" />

          <div className="relative z-10 flex h-full items-center justify-center px-4 text-center">
            <h1 className="max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[0.95] text-white">
              Nuestros <span className="text-[#e73c50]">Servicios</span>
            </h1>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.68 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <div ref={cardsViewportRef} className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar select-none scroll-smooth">
              <div className="flex gap-4 md:gap-5 w-max pr-2">
              {SERVICES.map((service, index) => {
                const cardImageCandidates = buildAssetCandidates(service.cardImage, IMAGE_EXTENSIONS);
                return (
                  <Link
                    key={`card-${service.id}`}
                    to={`/services/${service.slug}`}
                    data-service-card="true"
                    className="group relative h-[330px] w-[240px] sm:h-[342px] sm:w-[255px] lg:h-[350px] lg:w-[270px] rounded-2xl border border-white/12 overflow-hidden shrink-0 bg-[#171b46] transition-all duration-300 hover:border-white/30 hover:shadow-[0_18px_38px_rgba(0,0,0,0.35)]"
                    aria-label={`Ver servicio ${service.title}`}
                  >
                    <img
                      src={cardImageCandidates[0]}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="eager"
                      fetchPriority={index < 3 ? 'high' : 'auto'}
                      decoding="async"
                      data-candidates={cardImageCandidates.join('|')}
                      data-current-index="0"
                      onError={(event) => {
                        const candidates = (event.currentTarget.dataset.candidates || '').split('|').filter(Boolean);
                        const currentIndex = Number(event.currentTarget.dataset.currentIndex || '0');
                        const nextIndex = currentIndex + 1;

                        if (nextIndex < candidates.length) {
                          event.currentTarget.dataset.currentIndex = String(nextIndex);
                          event.currentTarget.src = candidates[nextIndex];
                          return;
                        }

                        event.currentTarget.style.opacity = '0';
                      }}
                    />

                    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-5 pb-5 pt-12 bg-gradient-to-t from-[#080b24]/78 via-[#080b24]/36 to-transparent">
                      <span className="inline-flex items-center justify-center rounded-md border border-[#e73c50]/70 bg-transparent px-6 py-2 text-sm font-semibold text-[#ff5f70] transition-all duration-300 group-hover:bg-[#e73c50] group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(231,60,80,0.35)]">
                        Ver mas
                      </span>
                    </div>
                  </Link>
                );
              })}
              </div>
            </div>

            <button
              type="button"
              onClick={moveCardsNext}
              className="h-12 w-12 shrink-0 rounded-full border border-white/22 bg-[#11163d]/90 text-white transition-all duration-300 hover:border-white/50 hover:bg-[#1a2058] hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
              aria-label="Ver siguientes servicios"
            >
              <SvgIcon
                path="M9 5l7 7-7 7"
                className="w-5 h-5 mx-auto"
                strokeWidth={2.2}
              />
            </button>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto w-[97%] overflow-hidden rounded-3xl p-10 lg:p-14 text-center"
          style={{ background: 'linear-gradient(135deg,#1e1c50 0%,#474192 55%,#6560b8 100%)' }}
        >
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
            }}
          />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-3">
              Las buenas marcas no aparecen por casualidad
            </h2>
            <p className="text-white/75 mb-8 max-w-xl mx-auto">
              Cuentanos tu idea y veamos hasta donde puede llegar.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 bg-white text-[#06071a] font-black rounded-full text-base shadow-lg transition-all"
              >
                Empezar proyecto
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
