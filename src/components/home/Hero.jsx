import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BRAND_LOGOS = [
  { name: 'Elevaria cafe', src: '/logos/Elevaria Logo.png' },
  { name: 'Barbarian Bar', src: '/logos/Barbarian Bar.png' },
  { name: 'Design Market', src: '/logos/Design Market.png' },
  { name: 'GMS', src: '/logos/GMS.png' },
  { name: 'Kanagawa Nikkei', src: '/logos/Kanagawa Nikkei.png' },
  { name: 'Corte87', src: '/logos/Corte87.png' },
  { name: 'DGary', src: '/logos/DGary.png' },
  { name: 'Ginecofeme', src: '/logos/Ginecofeme.png' },
  { name: 'RYC arquitectos', src: '/logos/RYC arquitectos.png' },
  { name: 'LaViejaTaberna', src: '/logos/LaViejaTaberna.png' },
  { name: 'smashboyburger', src: '/logos/smashboyburger.png' },
];

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#05060f]">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/services/hero/video-1.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.56)_0%,rgba(0,0,0,0.66)_54%,rgba(0,0,0,0.9)_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-4 pt-24 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-[26ch] text-balance text-4xl font-bold uppercase leading-[1.1] text-white sm:text-5xl md:text-[5rem]"
          >
            Somos rebeldes creativos y amantes de los resultados
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.55 }}
            className="mt-8 flex justify-center"
          >
            <Link to="/contact">
              <button className="inline-flex items-center gap-2 rounded-full bg-[#e73c50] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#cf3648]">
                Agendemos una llamada
                <span aria-hidden="true">&rarr;</span>
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="mx-auto mt-14 w-full max-w-6xl py-4"
        >
          <div className="pb-logo-fade overflow-hidden">
            <div className="pb-logo-track items-center gap-8 sm:gap-10" aria-label="Logos de clientes">
              {[...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
                <div
                  key={`${brand.name}-${idx}`}
                  className="h-[92px] min-w-[180px] px-4 sm:min-w-[250px] sm:px-8 flex items-center justify-center"
                >
                  <div className="h-[56px] w-[150px] sm:h-[68px] sm:w-[210px] flex items-center justify-center overflow-visible">
                    <img
                      src={brand.src}
                      alt={brand.name}
                      className={`h-full w-full object-contain opacity-95 [filter:brightness(0)_invert(1)] drop-shadow-[0_4px_14px_rgba(255,255,255,0.18)] origin-center transform-gpu ${
                        brand.name === 'Corte87'
                          ? 'scale-[2.9]'
                          : brand.name === 'LaViejaTaberna' || brand.name === 'GMS' || brand.name === 'Design Market' || brand.name === 'Kanagawa Nikkei' || brand.name === 'RYC arquitectos'
                          ? 'scale-[1.8]'
                          : brand.name === 'DGary'
                          ? 'scale-[0.7]'
                          : ''
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        aria-hidden="true"
      >
        <div className="relative h-[46px] w-[28px] rounded-full border-2 border-white/95">
          <motion.span
            className="absolute left-1/2 top-[8px] h-[8px] w-[2px] -translate-x-1/2 rounded-full bg-white"
            animate={{ y: [0, 10, 0], opacity: [1, 0.45, 1] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
