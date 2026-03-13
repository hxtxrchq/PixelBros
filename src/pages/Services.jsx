import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAssetUrl } from '../config/assets';

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

const HERO_COLLAGE = [
  { path: '/Portfolio/Fotografia/DOCTORA YURIKO/DSC04028.jpg', top: '10%', size: 'w-[72px] h-[90px] sm:w-[84px] sm:h-[106px]', duration: 42 },
  { path: '/Portfolio/Fotografia/DULCE CUIDADO/DSC02902.jpg', top: '22%', size: 'w-[88px] h-[72px] sm:w-[102px] sm:h-[84px]', duration: 39 },
  { path: '/Portfolio/Social Media/11_Ellos/2_Social Media/1_Feed/1_Febrero/2. Bolso Carrusel/POST-bolso-01.png', top: '36%', size: 'w-[86px] h-[86px] sm:w-[98px] sm:h-[98px]', duration: 45 },
  { path: '/Portfolio/Social Media/11_Ellos/2_Social Media/1_Feed/1_Febrero/3. Gorra bike/gorra bike-02.png', top: '52%', size: 'w-[100px] h-[76px] sm:w-[114px] sm:h-[86px]', duration: 47 },
  { path: '/Portfolio/Social Media/11_Ellos/2_Social Media/3. Fotos/Bolso2.png', top: '68%', size: 'w-[74px] h-[98px] sm:w-[86px] sm:h-[112px]', duration: 44 },
  { path: '/Portfolio/Fotografia/LA VIEJA TABERNA/DSC03047-Mejorado-NR.jpg', top: '18%', size: 'w-[108px] h-[82px] sm:w-[124px] sm:h-[94px]', duration: 48 },
  { path: '/Portfolio/Fotografia/DOCTORA YURIKO/FOTO_PERFIL.jpg', top: '58%', size: 'w-[80px] h-[104px] sm:w-[92px] sm:h-[118px]', duration: 41 },
  { path: '/Portfolio/Social Media/11_Ellos/2_Social Media/3. Fotos/BOX 2.png', top: '80%', size: 'w-[78px] h-[100px] sm:w-[90px] sm:h-[116px]', duration: 46 },
];

const SHOWCASE_SLIDES = [
  {
    id: 1,
    title: 'Branding',
    description:
      'Trabajamos la base de tu marca para que tenga una dirección clara. Definimos su identidad visual y lineamientos de comunicación para que todo lo que publiques mantenga coherencia.',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046500/pixelbros/Portfolio/Diseno_de_Identidad_Visual/Dulce_Cuidado/1.jpg',
    },
  },
  {
    id: 2,
    title: 'Contenido para Redes',
    description:
      'Creamos contenido que muestra lo mejor de tu marca y amplía su alcance en redes. Combinamos creatividad y anuncios para atraer más público y generar oportunidades de venta.',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046726/pixelbros/Portfolio/Social_Media/Design_Market/CLUB_DESING_DM.mp4',
    },
  },
  {
    id: 3,
    title: 'Publicidad Digital',
    description:
      'Creamos y gestionamos campañas en plataformas digitales para llegar a las personas correctas. Segmentamos, optimizamos y analizamos cada anuncio para que tu inversión tenga resultados claros.',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046683/pixelbros/Portfolio/Social_Media/Barbarian_Bar/BARBARIAN_OKTUBRE_FEST.mp4',
    },
  },
  {
    id: 4,
    title: 'Fotografía Profesional',
    description: 'Realizamos sesiones fotográficas que destacan lo mejor de tu marca.',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046610/pixelbros/Portfolio/Fotografia/DULCE_CUIDADO/DSC02914.jpg',
    },
  },
  {
    id: 5,
    title: 'Producción Audiovisual',
    description:
      'Desarrollamos piezas de video desde la idea hasta la edición final. Contenido audiovisual pensado para comunicar de forma clara y generar mayor impacto en plataformas digitales.',
    media: {
      type: 'video',
      src: 'https://res.cloudinary.com/dhhd92sgr/video/upload/v1772046479/pixelbros/Portfolio/AudioVisual/Elevaria_Servido_Con_Proposito/1.mp4',
    },
  },
  {
    id: 6,
    title: 'Estrategia Comercial',
    description:
      'Analizamos tu negocio para encontrar oportunidades de crecimiento. Te ayudamos a ordenar tu oferta, mejorar tu comunicación y definir acciones que impulsen tus ventas.',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046533/pixelbros/Portfolio/Diseno_de_Identidad_Visual/Entrepenauta/1.jpg',
    },
  },
  {
    id: 7,
    title: 'Activaciones BTL',
    description:
      'Diseñamos experiencias de marca fuera del entorno digital. Eventos, lanzamientos o intervenciones que generan interacción directa y recordación en tu público.',
    media: {
      type: 'image',
      src: 'https://res.cloudinary.com/dhhd92sgr/image/upload/v1772046627/pixelbros/Portfolio/Fotografia/LA_VIEJA_TABERNA/DSC03827-Mejorado-NR.jpg',
    },
  },
];

const HOLD_DURATION = 3200;
const FLIP_DURATION = 980;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const Services = () => {
  const [visibleSlide, setVisibleSlide] = useState(0);
  const [incomingSlide, setIncomingSlide] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipProgress, setFlipProgress] = useState(0);
  const frameRef = useRef(null);
  const holdTimerRef = useRef(null);

  const collageImages = useMemo(
    () =>
      HERO_COLLAGE.map((item) => ({
        ...item,
        url: optimizeCloudinaryImage(getAssetUrl(item.path), 560),
      })).filter((item) => Boolean(item.url)),
    []
  );

  const slides = useMemo(
    () =>
      SHOWCASE_SLIDES.map((slide) => ({
        ...slide,
        backgroundImage: resolveMediaToImage(slide.media, 1440),
      })).filter((slide) => Boolean(slide.backgroundImage)),
    []
  );

  useEffect(() => {
    if (!slides.length) return undefined;

    let isCancelled = false;
    const nextIndex = (visibleSlide + 1) % slides.length;

    holdTimerRef.current = setTimeout(() => {
      if (isCancelled) return;

      setIncomingSlide(nextIndex);
      setIsFlipping(true);
      setFlipProgress(0);

      const startedAt = performance.now();

      const tick = (now) => {
        if (isCancelled) return;

        const progress = Math.min((now - startedAt) / FLIP_DURATION, 1);
        setFlipProgress(progress);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
          return;
        }

        setVisibleSlide(nextIndex);
        setIncomingSlide(null);
        setIsFlipping(false);
        setFlipProgress(0);
      };

      frameRef.current = requestAnimationFrame(tick);
    }, HOLD_DURATION);

    return () => {
      isCancelled = true;
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [visibleSlide, slides.length]);

  const current = slides[visibleSlide] || null;
  const incoming = incomingSlide !== null ? slides[incomingSlide] || null : null;
  const safeFlip = Math.max(0, Math.min(1, flipProgress));
  const easedFlip = easeInOutCubic(safeFlip);
  const incomingClockwiseRotation = -180 + easedFlip * 180;
  const consumePercent = Math.max(0, Math.min(100, easedFlip * 100));
  const displayTitle = isFlipping && incoming && safeFlip >= 0.5 ? incoming.title : current?.title;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent pt-32 pb-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
          className="relative mb-16 min-h-[360px] sm:min-h-[420px] overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
            }}
          >
            {collageImages.map((img, idx) => (
              <motion.div
                key={`${img.path}-${idx}`}
                className={`absolute ${img.size} overflow-hidden rounded-[4px] shadow-[0_10px_28px_rgba(0,0,0,0.32)]`}
                style={{ top: img.top, left: `${106 + idx * 10}%` }}
                animate={{ x: ['0vw', '-320vw'] }}
                transition={{ duration: img.duration, repeat: Infinity, ease: 'linear', delay: idx * 0.24 }}
              >
                <img src={img.url} alt="Muestra de servicio" className="h-full w-full object-cover" loading="lazy" />
              </motion.div>
            ))}
          </div>

          <div className="relative z-20 flex min-h-[360px] sm:min-h-[420px] items-center justify-center px-6 text-center">
            <h1 className="max-w-4xl text-5xl sm:text-6xl lg:text-7xl font-display font-black leading-[0.96] text-white">
              Nuestros <span className="text-[#e73c50]">Servicios</span>
            </h1>
          </div>
        </motion.section>

        <section className="mb-20 flex justify-center">
          <div className="w-full max-w-[640px] [perspective:1700px]">
            <div className="relative overflow-hidden rounded-[30px]" style={{ aspectRatio: '1 / 1' }}>
              {current && (
                <div className="absolute inset-0 rounded-[30px] border border-white/20 shadow-[0_26px_78px_rgba(0,0,0,0.58)] overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${current.backgroundImage})` }}>
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,7,19,0.88)_6%,rgba(5,7,19,0.42)_36%,rgba(5,7,19,0.12)_66%,transparent_100%)]" />
                  <div className="absolute inset-y-0 left-0 w-[42%] bg-[radial-gradient(circle_at_0%_50%,rgba(231,60,80,0.32)_0%,rgba(231,60,80,0.16)_26%,transparent_72%)]" />
                  {!isFlipping && (
                    <div className="absolute inset-x-0 bottom-0 px-7 pb-8 sm:px-8 sm:pb-9">
                      <h2
                        className="max-w-[11ch] text-[2rem] sm:text-[2.35rem] font-display font-black leading-[0.9] tracking-[-0.02em] text-white"
                        style={{ textShadow: '0 4px 20px rgba(0,0,0,0.72)' }}
                      >
                        {current.title}
                      </h2>
                    </div>
                  )}
                </div>
              )}

              {isFlipping && current && incoming && (
                <div className="absolute inset-0">
                  <div
                    className="absolute inset-0 rounded-[30px] border border-white/20 shadow-[0_26px_78px_rgba(0,0,0,0.58)] overflow-hidden bg-cover bg-center"
                    style={{
                      backgroundImage: `url(${incoming.backgroundImage})`,
                      transform: `rotate(${incomingClockwiseRotation}deg)`,
                      transformOrigin: '50% 50%',
                      clipPath: `inset(0 ${100 - consumePercent}% 0 0 round 30px)`,
                      WebkitClipPath: `inset(0 ${100 - consumePercent}% 0 0 round 30px)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,7,19,0.88)_6%,rgba(5,7,19,0.42)_36%,rgba(5,7,19,0.12)_66%,transparent_100%)]" />
                    <div className="absolute inset-y-0 left-0 w-[42%] bg-[radial-gradient(circle_at_0%_50%,rgba(231,60,80,0.32)_0%,rgba(231,60,80,0.16)_26%,transparent_72%)]" />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 px-7 pb-8 sm:px-8 sm:pb-9 pointer-events-none">
                    <h2
                      className="max-w-[11ch] text-[2rem] sm:text-[2.35rem] font-display font-black leading-[0.9] tracking-[-0.02em] text-white"
                      style={{ textShadow: '0 4px 20px rgba(0,0,0,0.72)' }}
                    >
                      {displayTitle}
                    </h2>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

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
              Cuéntanos tu idea y veamos hasta dónde puede llegar.
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
