import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const SERVICES = [
  {
    id: 'branding',
    title: 'Branding',
    slug: 'identidad-visual',
    description: 'Trabajamos la base de tu marca para que tenga una direccion clara.',
    image: '/services/cards/branding.png',
    imagePosition: 'center',
  },
  {
    id: 'contenido',
    title: 'Contenido para redes',
    slug: 'contenidos',
    description: 'Creamos piezas visuales y copies para conectar con tu audiencia.',
    image: '/services/cards/contenido-para-redes.png',
    imagePosition: 'center',
  },
  {
    id: 'publicidad',
    title: 'Publicidad digital',
    slug: 'campanas-publicitarias',
    description: 'Campanas optimizadas para crecer en alcance, trafico y conversion.',
    image: '/services/cards/publicidad-digital.png',
    imagePosition: 'center',
  },
  {
    id: 'foto',
    title: 'Fotografia profesional',
    slug: 'fotografia-profesional',
    description: 'Direccion, produccion y edicion para elevar el valor de tu marca.',
    image: '/services/cards/fotografia-profesional.png',
    imagePosition: 'center',
  },
  {
    id: 'audiovisual',
    title: 'Produccion audiovisual',
    slug: 'produccion-audiovisual',
    description: 'Videos con narrativa comercial para posicionar tu propuesta.',
    image: '/services/cards/produccion-audiovisual.png',
    imagePosition: 'center',
  },
  {
    id: 'estrategia',
    title: 'Estrategia comercial',
    slug: 'asesoramiento-comercial',
    description: 'Alineamos marketing y negocio para que vendas con mas claridad.',
    image: '/services/cards/estrategia-comercial.png',
    imagePosition: 'center',
  },
];

const ArrowButton = ({ active }) => (
  <span
    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
      active
        ? 'border-[#e73c50] bg-[#e73c50] text-white'
        : 'border-white/30 text-white/80'
    }`}
  >
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
      <path
        d="M4 10h12m0 0l-4-4m4 4l-4 4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const ServiceTile = ({ service, active, onHover }) => {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      onMouseEnter={onHover}
      transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      className="group relative h-[230px] overflow-hidden rounded-xl border border-white/15 bg-[#05070f] p-4 shadow-[0_18px_34px_rgba(0,0,0,0.2)] sm:h-[250px]"
    >
      <Link to={`/services/${service.slug}`} className="absolute inset-0 z-20" aria-label={service.title} />

      <img
        src={service.image}
        alt={service.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        style={{ objectPosition: service.imagePosition || 'center' }}
        loading="lazy"
        decoding="async"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,26,0.08)_0%,rgba(6,7,26,0.34)_38%,rgba(6,7,26,0.84)_100%)]" />

      <div className="relative z-10 flex h-full items-end justify-end">
        <ArrowButton active={active} />
      </div>
    </motion.article>
  );
};

const ServicesCarousel = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const rowA = useMemo(() => SERVICES.slice(0, 3), []);
  const rowB = useMemo(() => SERVICES.slice(3, 6), []);

  const getSpanClass = (row, id) => {
    const hasActive = !!hoveredId && row.some((item) => item.id === hoveredId);
    if (!hasActive) return 'col-span-4';
    return hoveredId === id ? 'col-span-6' : 'col-span-3';
  };

  return (
    <section className="bg-[#06071a] py-16">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-4xl font-medium text-white sm:text-5xl">
          Nuestros <span className="text-[#e73c50]">servicios</span>
        </h2>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {rowA.map((service) => (
              <motion.div key={service.id} layout className={getSpanClass(rowA, service.id)}>
                <ServiceTile
                  service={service}
                  active={hoveredId === service.id}
                  onHover={() => setHoveredId(service.id)}
                />
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            {rowB.map((service) => (
              <motion.div key={service.id} layout className={getSpanClass(rowB, service.id)}>
                <ServiceTile
                  service={service}
                  active={hoveredId === service.id}
                  onHover={() => setHoveredId(service.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesCarousel;
