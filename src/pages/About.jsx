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
    tag: 'Dirección',
    images: [
      ['/team/erika1.jpg'],
      ['/team/erika2.jpg'],
    ],
  },
  {
    id: 2,
    name: 'Mave',
    role: 'Diseñador multimedia',
    tag: 'Diseño',
    images: [
      ['/team/mave1.jpg'],
      ['/team/mave2.jpg'],
    ],
  },
  {
    id: 3,
    name: 'Andrea',
    role: 'Content creator',
    tag: 'Contenido',
    images: [
      ['/team/andrea1.jpg'],
      ['/team/andrea2.jpg'],
    ],
  },
  {
    id: 4,
    name: 'Alonso',
    role: 'Programador Web',
    tag: 'Web',
    images: [
      ['/team/alonso1.jpg'],
      ['/team/alonso2.jpg'],
    ],
  },
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
      <div className="relative h-72 rounded-2xl overflow-hidden border border-white/12 shadow-[0_10px_26px_rgba(0,0,0,0.5)] mb-3 bg-[#0d0e24]">
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

        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-black/50 text-white/90 backdrop-blur-sm">
            {member.tag}
          </span>
        </div>
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
      <section className="pt-32 pb-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-white">
              Somos <span className="text-[#e73c50]">PixelBros</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/65 max-w-4xl mx-auto leading-relaxed">
              Una agencia de marketing digital donde la estrategia, la creatividad y el negocio se combinan para construir marcas que crecen.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white">
                  Nuestra <span className="text-[#e73c50]">Historia</span>
              </h2>
                <div className="space-y-4 text-white/65 text-lg">
                <p>
                  PixelBros nace en 2020 como una agencia creativa de contenido, con la idea de que muchas veces las grandes ideas empiezan desde lo más pequeño. De ahí viene Pixel, la unidad mínima que, al juntarse con otras, puede construir algo mucho más grande.
                </p>
                <p>
                  El Bros viene curiosamente de Mario Bros, como una referencia a ese espíritu creativo con el que nació la agencia.
                </p>
                <p>
                  En PixelBros trabajamos ideas, contenido y estrategia para ayudar a las marcas a crecer y destacar. También integramos la ingeniería empresarial, porque entendemos que el marketing no va solo, sino que forma parte de todo lo que mueve a una empresa.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                { number: '450+', label: 'Proyectos Completados' },
                { number: '200+', label: 'Clientes Satisfechos' },
                { number: '85%', label: 'Tasa de Retención' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#0d0e24] p-6 rounded-2xl min-h-[145px] flex items-center"
                >
                  <AnimatedCounter
                    number={stat.number}
                    label={stat.label}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-[#06071a] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e73c50] mb-3">El equipo</p>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-2 text-white">
                Nuestro <span className="text-[#e73c50]">Equipo</span>
              </h2>
              <p className="text-base text-white/55">
                Nos tomamos en serio el trabajo detrás de una buena idea.
              </p>
            </div>
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
      <section className="py-20 bg-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[30px] border border-[#474192]/35 bg-[#0b0d22] shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
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
              <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-[#e73c50]/0 via-[#e73c50]/60 to-[#e73c50]/0" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] items-center gap-8 px-7 py-9 sm:px-10 sm:py-12">
              <div className="relative z-10">
                <h2 className="max-w-2xl text-3xl font-display font-bold leading-[1.05] text-white sm:text-4xl md:text-5xl">
                  Si te dicen que piensas demasiado, <span className="text-[#e73c50]">postula.</span>
                </h2>

                <Link to="/postula" className="inline-block mt-8">
                  <motion.button
                    whileHover={{ y: -2, boxShadow: '0 18px 42px rgba(231,60,80,0.32)' }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-[10px] border border-[#e73c50] bg-[#e73c50] px-10 py-3.5 text-base font-bold text-white transition-colors duration-300 hover:bg-[#c9303f]"
                  >
                    Vamos
                  </motion.button>
                </Link>
              </div>

              <div className="relative flex min-h-[220px] items-center justify-center lg:min-h-[260px]">
                <motion.div
                  className="relative w-full max-w-[320px]"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <img
                    src={LogoPixelBros}
                    alt="Logo PixelBros"
                    className="relative z-20 w-full object-contain drop-shadow-[0_14px_34px_rgba(0,0,0,0.45)]"
                    loading="lazy"
                  />

                  {/* Capas de color para efecto glitch/pixel sutil */}
                  <motion.img
                    src={LogoPixelBros}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 w-full object-contain opacity-0 mix-blend-screen"
                    animate={{ x: [0, 2, -1, 0], opacity: [0, 0.16, 0, 0.12, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', repeatDelay: 1.2 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(231,60,80,0.8))' }}
                  />
                  <motion.img
                    src={LogoPixelBros}
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-10 w-full object-contain opacity-0 mix-blend-screen"
                    animate={{ x: [0, -2, 1, 0], opacity: [0, 0.14, 0, 0.1, 0] }}
                    transition={{ duration: 2.1, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(71,65,146,0.85))' }}
                  />

                  <motion.div
                    className="pointer-events-none absolute inset-0 z-30 opacity-0"
                    animate={{ opacity: [0, 0.22, 0, 0.14, 0], y: [0, -2, 2, -1, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 1.3 }}
                    style={{
                      background:
                        'repeating-linear-gradient(to bottom, rgba(255,255,255,0.28) 0px, rgba(255,255,255,0.28) 1px, transparent 1px, transparent 4px)',
                    }}
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


