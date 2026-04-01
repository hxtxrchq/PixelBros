import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMemo, useRef } from 'react';
import { getAssetUrl } from '../config/assets';
import SvgIcon from '../components/SvgIcon';

const optimizeCloudinaryImage = (url, width = 1400) => {
  if (!url || !url.includes('/image/upload/')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`);
};

const videoPosterFromCloudinary = (videoUrl, width = 1400) => {
  if (!videoUrl || !videoUrl.includes('/video/upload/')) return videoUrl;
  return videoUrl
    .replace('/video/upload/', `/video/upload/so_0,f_jpg,q_auto,w_${width}/`)
    .replace(/\.(mp4|webm)$/i, '.jpg');
};

const resolveMediaToImage = (media, width = 1400) => {
  if (!media?.src) return '';
  if (media.type === 'video') return videoPosterFromCloudinary(media.src, width);
  return optimizeCloudinaryImage(media.src, width);
};

const HERO_LOOP_MEDIA = [
  { type: 'video', src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046479/pixelbros/Portfolio/AudioVisual/Elevaria_Servido_Con_Proposito/1.mp4' },
  { type: 'image', src: getAssetUrl('/Portfolio/Fotografia/DULCE CUIDADO/DSC02902.jpg') },
  { type: 'image', src: getAssetUrl('/Portfolio/Social Media/11_Ellos/2_Social Media/1_Feed/1_Febrero/2. Bolso Carrusel/POST-bolso-01.png') },
  { type: 'video', src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046726/pixelbros/Portfolio/Social_Media/Design_Market/CLUB_DESING_DM.mp4' },
  { type: 'image', src: getAssetUrl('/Portfolio/Fotografia/LA VIEJA TABERNA/DSC03047-Mejorado-NR.jpg') },
  { type: 'image', src: getAssetUrl('/Portfolio/Social Media/11_Ellos/2_Social Media/3. Fotos/BOX 2.png') },
];

const SERVICES = [
  {
    id: 1,
    title: 'BRANDING',
    slug: 'identidad-visual',
    iconPath:
      'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
  {
    id: 2,
    title: 'ESTRATEGIA COMERCIAL',
    slug: 'asesoramiento-comercial',
    iconPath:
      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    id: 3,
    title: 'PUBLICIDAD DIGITAL',
    slug: 'campanas-publicitarias',
    iconPath:
      'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  },
  {
    id: 4,
    title: 'FOTOGRAFIA PROFESIONAL',
    slug: 'fotografia-profesional',
    iconPath:
      'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z M15 13a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    id: 5,
    title: 'CONTENIDOS',
    slug: 'contenidos',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  },
  {
    id: 6,
    title: 'PRODUCCION AUDIOVISUAL',
    slug: 'produccion-audiovisual',
    iconPath: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  },
];

const Services = () => {
  const cardsViewportRef = useRef(null);

  const heroLoopItems = useMemo(
    () =>
      HERO_LOOP_MEDIA.map((item, index) => ({
        key: `${item.src}-${index}`,
        image: resolveMediaToImage(item, 1000),
      })).filter((item) => Boolean(item.image)),
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
                    <img src={item.image} alt={idx < heroLoopItems.length ? 'Muestra de servicio' : ''} className="h-full w-full object-cover" loading="lazy" />
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
                const isOdd = index % 2 === 1;
                return (
                  <Link
                    key={`card-${service.id}`}
                    to={`/services/${service.slug}`}
                    data-service-card="true"
                    className="group relative h-[330px] w-[240px] sm:h-[342px] sm:w-[255px] lg:h-[350px] lg:w-[270px] rounded-2xl border border-white/12 overflow-hidden shrink-0"
                    style={{
                      background: isOdd
                        ? 'linear-gradient(140deg, rgba(25,29,62,0.94) 0%, rgba(30,33,74,0.93) 52%, rgba(36,40,82,0.95) 100%)'
                        : 'linear-gradient(140deg, rgba(32,42,116,0.92) 0%, rgba(56,64,141,0.9) 55%, rgba(76,83,170,0.92) 100%)',
                    }}
                  >
                    <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(circle at 84% 12%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.04) 35%, transparent 72%)' }} />
                    <div className="absolute inset-0 opacity-[0.16]" style={{ backgroundImage: 'linear-gradient(128deg, transparent 14%, rgba(255,255,255,0.16) 15%, transparent 16%, transparent 44%, rgba(255,255,255,0.12) 45%, transparent 46%, transparent 63%, rgba(255,255,255,0.1) 64%, transparent 65%)' }} />

                    <div className="relative z-10 flex h-full flex-col px-6 pt-6 pb-5">
                      <div className="mb-7 flex justify-end">
                        <div className="rounded-full border border-white/20 bg-[#0e102d]/40 p-2.5 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <SvgIcon path={service.iconPath} className="w-6 h-6" strokeWidth={1.8} />
                        </div>
                      </div>

                      <h2 className="mt-auto text-center text-[1.6rem] sm:text-[1.72rem] font-display font-black leading-[0.95] tracking-[-0.015em] text-white px-1">
                        {service.title}
                      </h2>

                      <div className="mt-8 flex justify-center">
                        <span className="inline-flex items-center justify-center rounded-md border border-[#e73c50]/70 bg-transparent px-6 py-2 text-sm font-semibold text-[#ff5f70] transition-all duration-300 group-hover:bg-[#e73c50] group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(231,60,80,0.35)]">
                          Ver mas
                        </span>
                      </div>
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
