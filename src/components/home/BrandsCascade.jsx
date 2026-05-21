import { motion } from 'framer-motion';

const BRAND_BUBBLES = [
  { name: 'Barbarian Bar', src: '/logos/Barbarian Bar.png' },
  { name: 'Laboralis', src: '/logos/GMS.png' },
  { name: 'La Vieja Taberna', src: '/logos/LaViejaTaberna.png' },
  { name: 'Dulce Cuidado', src: '/logos/Design Market.png' },
  { name: 'Villa Brasa', src: '/logos/Corte87.png' },
  { name: 'Entrepenauta', src: '/logos/RYC arquitectos.png' },
];

// ARREGLADO: Distribución exacta por índices individuales para que los logos vuelvan a aparecer
const COLS = [
  [BRAND_BUBBLES[0], BRAND_BUBBLES[3], BRAND_BUBBLES[5]], // Columna 1
  [BRAND_BUBBLES[1], BRAND_BUBBLES[2], BRAND_BUBBLES[1]], // Columna 2
  [BRAND_BUBBLES[4], BRAND_BUBBLES[5], BRAND_BUBBLES[4]], // Columna 3
];

const Bubble = ({ brand }) => (
  <div className="mx-auto flex h-[132px] w-[132px] items-center justify-center rounded-full bg-[#f2f2f2] shadow-[0_8px_22px_rgba(0,0,0,0.28)]">
    <img
      src={brand.src}
      alt={brand.name}
      className="h-[58%] w-[58%] object-contain [filter:grayscale(1)_brightness(0.2)]"
      loading="lazy"
      decoding="async"
    />
  </div>
);

const BrandsCascade = () => {
  return (
    <section className="relative overflow-hidden bg-[#06071a] py-16 sm:py-20">
      
      {/* NO MODIFICADO: Mantiene tu posición y diseño exactos */}
      <div className="pointer-events-none absolute right-[7%] bottom-[-40px] z-0 flex items-center justify-end overflow-hidden">
        <img 
          src="public/favicon.png" 
          alt="Logo Pixel" 
          className="h-[380px] w-auto object-contain opacity-35 filter grayscale brightness-[0.5] sm:h-[450px] md:h-[500px]"
          loading="lazy"
        />
      </div>

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-8 relative z-10">
        
        {/* Contenedor de la cascada izquierda */}
        <div className="relative h-[520px] overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-[#06071a] to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-[#06071a] to-transparent" />

          <div className="grid h-full grid-cols-3 gap-4 px-5">
            {COLS.map((col, i) => (
              <div key={`col-${i}`} className="relative overflow-hidden">
                <div
                  className="pb-cascade-track"
                  style={{
                    animationDuration: `${18 + i * 2}s`,
                    animationDelay: `${i * 0.75}s`,
                  }}
                >
                  {[...col, ...col].map((brand, idx) => (
                    <div key={`${brand.name}-${idx}`} className="py-5">
                      <Bubble brand={brand} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NO MODIFICADO: Mantiene las letras en 2 líneas exactamente igual */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55 }}
          className="flex items-center justify-start lg:pl-10 relative z-10"
        >
          <h2 className="max-w-none text-4xl font-semibold leading-[1.2] text-white sm:text-5xl lg:text-[2.85rem] tracking-tight">
            Marcas que <span className="text-[#e73c50]">confiaron</span> <br className="hidden sm:inline" /> en nosotros
          </h2>
        </motion.div>

      </div>
    </section>
  );
};

export default BrandsCascade;
