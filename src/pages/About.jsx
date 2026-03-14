import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AnimatedCounter from '../components/AnimatedCounter';
import LogoPixelBros from '../images/LogoPixelBros.png';

const TEAM = [
  {
    id: 1,
    name: 'Erika',
    role: 'Gerente General',
    imagePosition: 'center 20%',
    images: [
      ['/team/erika1.jpg'],
      ['/team/erika2.jpg'],
    ],
  },
  {
    id: 2,
    name: 'Mave',
    role: 'Diseñador multimedia',
    imagePosition: 'center 18%',
    images: [
      ['/team/mave1.jpg'],
      ['/team/mave2.jpg'],
    ],
  },
  {
    id: 3,
    name: 'Andrea',
    role: 'Content creator',
    imagePosition: 'center 16%',
    images: [
      ['/team/andrea1.jpg'],
      ['/team/andrea2.jpg'],
    ],
  },
  {
    id: 4,
    name: 'Alonso',
    role: 'Programador Web',
    imagePosition: 'center 14%',
    images: [
      ['/team/alonso1.jpg'],
      ['/team/alonso2.jpg'],
    ],
  },
];

const BRAND_LOGOS = [
  { name: 'Elevaria cafe', src: '/logos/Elevaria Logo.png' },
  { name: 'Barbarian Bar', src: '/logos/Barbarian Bar.png' },
  { name: 'Design Market', src: '/logos/Design Market.png' },
  { name: 'GMS', src: '/logos/GMS.png' },
  { name: 'Kanagawa Nikkei', src: '/logos/Kanagawa Nikkei.png' },
];

const ABOUT_METRICS = [
  { number: '450+', label: 'Proyectos completados', accent: false },
  { number: '200+', label: 'Clientes satisfechos', accent: true },
  { number: '85%', label: 'Tasa de retención', accent: false },
];

const TeamCard = ({ member, globalTick, index }) => {
  const total = member.images.length || 1;
  const [displayIdx, setDisplayIdx] = useState(0);
  const [candidateIdx, setCandidateIdx] = useState(0);
  const [loadedMap, setLoadedMap] = useState({});
  const activeCandidates = member.images[displayIdx] || [];
  const candidateList = Array.isArray(activeCandidates) ? activeCandidates : [activeCandidates];
  const displayImg = candidateList[candidateIdx] || '';

  useEffect(() => {
    setCandidateIdx(0);
  }, [displayIdx]);

  useEffect(() => {
    const preload = (src) => {
      if (!src || loadedMap[src]) return;
      const img = new Image();
      img.onload = () => setLoadedMap((prev) => ({ ...prev, [src]: true }));
      img.onerror = () => setLoadedMap((prev) => ({ ...prev, [src]: false }));
      img.src = src;
    };

    member.images.forEach((slot) => {
      const variants = Array.isArray(slot) ? slot : [slot];
      variants.forEach(preload);
    });
  }, [member.images, loadedMap]);

  useEffect(() => {
    const targetIdx = globalTick % total;
    if (targetIdx === displayIdx) return;

    const targetCandidates = member.images[targetIdx] || [];
    const targetList = Array.isArray(targetCandidates) ? targetCandidates : [targetCandidates];
    const readyCandidate = targetList.find((src) => loadedMap[src]);

    if (readyCandidate) {
      setDisplayIdx(targetIdx);
      setCandidateIdx(targetList.indexOf(readyCandidate));
    }
  }, [globalTick, total, member.images, loadedMap, displayIdx]);

  const handleImageError = () => {
    if (candidateIdx < candidateList.length - 1) {
      setCandidateIdx((idx) => idx + 1);
      return;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.07, duration: 0.55, ease: 'easeOut' }}
      className="group relative flex flex-col"
    >
      <div className="relative h-72 overflow-hidden mb-3 bg-[#0d0e24] rounded-[14px]">
        <AnimatePresence mode="sync">
          <motion.div
            key={displayImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {displayImg ? (
              <img
                src={displayImg}
                alt={member.name}
                className="h-full w-full object-cover"
                style={{ objectPosition: member.imagePosition || 'center 18%' }}
                loading="lazy"
                onError={handleImageError}
              />
            ) : (
              <div className="h-full w-full bg-[linear-gradient(145deg,#1e1c50,#0e122d)] flex items-center justify-center">
                <span className="text-white/85 text-4xl font-display font-bold">{member.name.charAt(0)}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_48%,rgba(0,0,0,0.35)_80%,rgba(0,0,0,0.55)_100%)]" />

      </div>

      <h3 className="text-lg font-bold text-white leading-tight">{member.name}</h3>
      <p className="text-sm text-[#e73c50] font-medium mt-0.5">{member.role}</p>
    </motion.div>
  );
};

const About = () => {
  const [globalTick, setGlobalTick] = useState(0);

  // Cambio automatico de foto por card
  useEffect(() => {
    const id = setInterval(() => setGlobalTick((t) => t + 1), 5200);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero */}
      <section className="pt-28 pb-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(140deg,#0c0f20_0%,#06091b_100%)]"
          >
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(231,60,80,0.36) 0%, transparent 32%), radial-gradient(circle at 90% 20%, rgba(255,255,255,0.06) 0%, transparent 30%)' }} />
            <div className="absolute -left-6 bottom-[-34px] text-[100px] sm:text-[160px] font-display font-black tracking-tight text-white/[0.04] leading-none select-none">PIXEL</div>
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 p-7 sm:p-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#e73c50]">Quiénes somos</p>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[0.92] text-white max-w-[12ch]">
                  Somos <span className="text-[#e73c50]">PixelBros</span>
                </h1>
                <p className="mt-6 max-w-2xl text-base sm:text-lg text-white/80 leading-relaxed">
Una agencia de marketing digital donde la estrategia, la creatividad y el negocio se combinan para construir marcas que crecen.                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 self-end">
                {ABOUT_METRICS.map((stat) => (
                  <div key={stat.label} className={`min-h-[150px] px-3 py-4 flex items-center ${stat.accent ? 'rounded-xl bg-[#e73c50]' : 'rounded-xl bg-white/[0.04]'}`}>
                    <AnimatedCounter
                      number={stat.number}
                      label={stat.label}
                      delay={0.08}
                      numberClassName="text-white"
                      suffixClassName={stat.accent ? 'text-white' : 'text-[#e73c50]'}
                      labelClassName={stat.accent ? 'text-white/95' : 'text-white/85'}
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="pb-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="pointer-events-none absolute -left-6 top-1/2 h-24 w-1 -translate-y-1/2 bg-[#e73c50]" />
            <div className="pointer-events-none absolute right-4 top-6 h-32 w-32 rounded-full bg-[#e73c50]/14 blur-3xl" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-7 px-2 sm:px-4">
              <div className="text-center lg:pt-24">
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#e73c50] mb-3">Nuestra historia</p>
                <h2 className="mx-auto text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white max-w-[11ch] leading-[0.94]">
                  Así empezó PixelBros
                </h2>
                
              </div>

              <div className="space-y-4 text-white/95 text-base sm:text-lg leading-relaxed lg:pt-7">
                <p>
PixelBros nace en 2020 como una agencia creativa de contenido, con la idea de que muchas veces las grandes ideas empiezan desde lo más pequeño. De ahí viene Pixel, la unidad mínima que, al juntarse con otras, puede construir algo mucho más grande.                </p>
                <p>
El Bros viene curiosamente de Mario Bros, como una referencia a ese espíritu creativo con el que nació la agencia.                </p>
                <p>
En PixelBros trabajamos ideas, contenido y estrategia para ayudar a las marcas a crecer y destacar. También integramos la ingeniería empresarial, porque entendemos que el marketing no va solo, sino que forma parte de todo lo que mueve a una empresa.                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brands */}
      <section className="pb-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <h2 className="text-3xl sm:text-4xl font-display font-black text-white leading-none">
                Marcas <span className="text-[#e73c50]">Aliadas</span>
              </h2>
              <p className="text-sm text-white/76">Algunas marcas que confían en nosotros</p>
            </div>

            <div className="pointer-events-none absolute inset-x-0 top-[46px] h-px bg-gradient-to-r from-transparent via-white/28 to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-[2px] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="pb-logo-fade overflow-hidden py-2">
              <div className="pb-logo-track items-center gap-8 sm:gap-10" aria-label="Logos de clientes">
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
                  <div
                    key={`${brand.name}-${idx}`}
                    className="h-[112px] min-w-[220px] sm:min-w-[290px] px-6 sm:px-10 flex items-center justify-center"
                  >
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className="max-h-[72px] sm:max-h-[86px] w-auto object-contain opacity-95 [filter:brightness(0)_invert(1)] drop-shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="pb-12 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e73c50] mb-2">El equipo</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-white">
              Nuestro <span className="text-[#e73c50]">Equipo</span>
            </h2>
            <p className="mt-2 text-white/86 text-sm sm:text-base">
              Nos tomamos en serio el trabajo detrás de una buena idea.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {TEAM.map((member, index) => (
              <TeamCard
                key={member.id}
                member={member}
                globalTick={globalTick}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl border border-[#474192]/35 bg-[#0b0d22] shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
          >
            <div className="absolute inset-0">
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(120deg, #111434 0%, #0a0d22 46%, #090b1b 100%)',
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              <div
                className="absolute -left-20 top-8 h-36 w-[55%] -skew-x-12 opacity-25"
                style={{ background: 'linear-gradient(90deg, #474192 0%, rgba(71,65,146,0) 100%)' }}
              />
              <div
                className="absolute right-0 bottom-0 h-40 w-[45%] skew-x-[-16deg] opacity-25"
                style={{ background: 'linear-gradient(270deg, #e73c50 0%, rgba(231,60,80,0) 85%)' }}
              />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e73c50]/55 to-transparent" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-6 px-6 py-7 sm:px-8 sm:py-8">
              <div className="relative z-10">
                <h2 className="max-w-2xl text-2xl font-display font-bold leading-[1.08] text-white sm:text-3xl md:text-4xl">
                  Si te dicen que piensas demasiado, <span className="text-[#e73c50]">postula.</span>
                </h2>

                <Link to="/postula" className="inline-block mt-6">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 18px 42px rgba(231,60,80,0.32)' }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-[10px] border border-[#e73c50] bg-[#e73c50] px-8 py-3 text-sm sm:text-base font-bold text-white transition-colors duration-300 hover:bg-[#c9303f]"
                  >
                    Vamos
                  </motion.button>
                </Link>
              </div>

              <div className="relative flex min-h-[190px] items-center justify-center lg:min-h-[220px]">
                <motion.div
                  className="relative w-full max-w-[220px]"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img
                    src={LogoPixelBros}
                    alt="Logo PixelBros"
                    className="relative z-20 w-full object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                    loading="lazy"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;


