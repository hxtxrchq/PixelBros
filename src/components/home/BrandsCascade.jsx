import { motion } from 'framer-motion';

const BRAND_BUBBLES = [
  { name: 'Barbarian Bar', src: '/logos/Barbarian Bar.png' },
  { name: 'Elevaria cafe', src: '/logos/Elevaria Logo.png' },
  { name: 'DGary', src: '/logos/DGary.png' },
  { name: 'Design Market', src: '/logos/Design Market.png' },
  { name: 'Corte87', src: '/logos/Corte87.png' },
  { name: 'RYC arquitectos', src: '/logos/RYC arquitectos.png' },
  { name: 'Frissagio', src: '/logos/Frissagio.png' },
  { name: 'GMS', src: '/logos/GMS.png' },
  { name: 'DRA_YURIKO', src: '/logos/DRA_YURIKO.png' },
  { name: 'LaViejaTaberna', src: '/logos/LaViejaTaberna.png' },
  { name: 'Kanagawa Nikkei', src: '/logos/Kanagawa Nikkei.png' },
  { name: 'smashboyburger', src: '/logos/smashboyburger.png' },
  { name: 'ginecofeme', src: '/logos/ginecofeme.png' },
];

const COLS = [
  BRAND_BUBBLES.slice(0, 4),
  BRAND_BUBBLES.slice(4, 8),
  BRAND_BUBBLES.slice(8, 12),
];

const getLogoScaleClass = (brandName) => {
  if (brandName === 'Corte87') {
    return 'scale-[1.8]';
  }
  if (brandName === 'LaViejaTaberna') {
    return 'scale-[1.9]';
  }
  if (brandName === 'Barbarian Bar') {
    return 'scale-[2.1]';
  }
  if (brandName === 'GMS' || brandName === 'Design Market' || brandName === 'Kanagawa Nikkei' || brandName === 'DRA_YURIKO') {
    return 'scale-[1.4]';
  }
  if (brandName === 'DGary') {
    return 'scale-[0.85]';
  }
  if (brandName === 'smashboyburger') {
    return 'scale-[1.6]';
  }
  if (brandName === 'ginecofeme') {
    return 'scale-[0.6]';
  }

  return '';
};

const Bubble = ({ brand }) => (
  <div className="mx-auto flex h-[104px] w-[104px] items-center justify-center rounded-full bg-[#f2f2f2] shadow-[0_8px_22px_rgba(0,0,0,0.28)] sm:h-[132px] sm:w-[132px]">
    <img
      src={brand.src}
      alt={brand.name}
      className={`h-[58%] w-[58%] object-contain [filter:grayscale(1)_brightness(0.2)] ${getLogoScaleClass(brand.name)}`}
      loading="eager"
      fetchpriority="high"
    />
  </div>
);

const BrandsCascade = () => {
  return (
    <section className="relative overflow-hidden bg-[#06071a] py-12 sm:py-20">
      <div className="pointer-events-none absolute right-[7%] bottom-[-40px] z-0 hidden items-center justify-end overflow-hidden lg:flex">
        <img
          src="/favicon.png"
          alt="Logo Pixel"
          className="h-[380px] w-auto object-contain opacity-35 filter grayscale brightness-[0.5] sm:h-[450px] md:h-[500px]"
          loading="lazy"
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 relative z-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="order-1 flex items-center justify-start lg:order-2 lg:pl-10 relative z-10"
        >
          <h2 className="max-w-none text-[1.55rem] font-semibold leading-[1.02] text-white sm:text-5xl lg:text-[2.85rem] tracking-tight">
            Marcas que <span className="text-[#e73c50]">confiaron</span> <br className="hidden sm:inline" /> en nosotros
          </h2>
        </motion.div>

        <div className="relative order-2 h-[270px] overflow-hidden sm:h-[460px] lg:h-[520px] lg:order-1">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#06071a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#06071a] to-transparent" />

          <div className="grid h-full grid-cols-3 gap-1 px-0 sm:gap-4 sm:px-4 lg:px-5">
            {COLS.map((col, columnIndex) => (
              <div
                key={`col-${columnIndex}`}
                className={`relative overflow-hidden ${columnIndex === 1 ? 'pt-10 sm:pt-16' : ''} ${columnIndex === 2 ? 'pt-4 sm:pt-10' : ''}`}
              >
                <div
                  className="pb-cascade-track"
                  style={{
                    animationDuration: `${16 + columnIndex * 2.5}s`,
                    animationDelay: `${columnIndex * 0.8}s`,
                  }}
                >
                  {[...col, ...col].map((brand, brandIndex) => (
                    <motion.div
                      key={`${brand.name}-${brandIndex}`}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-20px' }}
                      transition={{ duration: 0.35, delay: brandIndex * 0.03 }}
                      className="py-1.5 sm:py-5"
                    >
                      <Bubble brand={brand} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="order-3 -mt-6 flex justify-center lg:hidden">
          <img
            src="/favicon.png"
            alt="Logo Pixel"
            className="h-[136px] w-auto object-contain opacity-35 grayscale brightness-[0.8] drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default BrandsCascade;
