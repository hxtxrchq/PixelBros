import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedCounter from '../components/AnimatedCounter';
import LogoIconPixel from '../images/LogoIconPixel.png';

const About = () => {
  const team = [
    { id: 1, name: 'Ana Martínez', role: 'CEO & Estratega', gradient: 'from-purple-500 to-pink-500' },
    { id: 2, name: 'Carlos Rivera', role: 'Director Creativo', gradient: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Laura González', role: 'Head de Marketing', gradient: 'from-red-500 to-orange-500' },
    { id: 4, name: 'Miguel Torres', role: 'Director Audiovisual', gradient: 'from-green-500 to-teal-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-transparent"
    >
      {/* Hero */}
      <section className="pt-32 pb-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-6 text-[#1F1F1F]">
              Somos <span className="text-[#B3262E]">PixelBros</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#4A4A4A] max-w-4xl mx-auto leading-relaxed">
              Una agencia de marketing digital premium que transforma marcas en experiencias inolvidables. 
              Combinamos creatividad, estrategia y tecnología para llevar tu negocio al siguiente nivel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-[#1F1F1F]">
                  Nuestra <span className="text-[#B3262E]">Historia</span>
              </h2>
                <div className="space-y-4 text-[#4A4A4A] text-lg">
                <p>
                  Fundada en 2020, PixelBros nació de la visión de crear una agencia diferente. 
                  Una donde el cliente no es solo un número, sino un socio en el camino hacia el éxito.
                </p>
                <p>
                  En estos años hemos trabajado con más de 50 marcas, desde startups disruptivas 
                  hasta empresas consolidadas, ayudándoles a alcanzar sus objetivos de marketing digital.
                </p>
                <p>
                  Hoy somos un equipo de profesionales apasionados por lo que hacemos, 
                  comprometidos con la excelencia y obsesionados con los resultados.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: '500+', label: 'Proyectos Completados' },
                { number: '50+', label: 'Clientes Satisfechos' },
                { number: '98%', label: 'Tasa de Retención' },
                { number: '15+', label: 'Premios Ganados' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#FFF1F3] p-6 rounded-2xl border border-[#F0E6E8]"
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
      <section className="py-20 bg-[#FFF1F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-[#1F1F1F]">
                Nuestro <span className="text-[#B3262E]">Equipo</span>
            </h2>
              <p className="text-xl text-[#4A4A4A]">
              Profesionales apasionados por crear experiencias digitales excepcionales
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <motion.div
                  className={`h-80 rounded-2xl bg-gradient-to-br ${member.gradient} mb-4 relative overflow-hidden shadow-lg`}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    duration: 4 + index * 0.35,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                  whileHover={{
                      y: -20,
                      boxShadow: '0 25px 50px rgba(179, 38, 46, 0.2)',
                  }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-all"
                    whileHover={{ opacity: 0.05 }}
                  />
                </motion.div>
                <h3 className="text-xl font-display font-bold mb-1 text-[#1F1F1F]">{member.name}</h3>
                <p className="text-[#B3262E]">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] border border-[#F0E6E8] bg-white shadow-lg"
          >
            <div className="absolute inset-0">
              <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#FFF1F3] blur-3xl" />
              <div className="absolute right-8 bottom-8 h-56 w-56 rounded-full bg-[#F25C66]/10 blur-3xl" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B3262E]/40 to-transparent" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center px-10 py-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B3262E] mb-4">
                  Convocatoria creativa
                </p>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-[#1F1F1F]">
                  El proximo <span className="text-[#B3262E]">PixelBros</span> podrias ser tu
                </h2>
                <p className="text-[#4A4A4A] mb-8">
                  Queremos mentes inquietas, curiosas y con hambre de crear. Postula y cuentanos que te mueve.
                </p>
                <Link to="/postula">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 18px 45px rgba(179, 38, 46, 0.3)' }}
                    whileTap={{ scale: 0.96 }}
                    className="px-8 py-4 bg-[#B3262E] text-white font-bold rounded-xl text-lg shadow-lg transition-all"
                  >
                    Postula aqui
                  </motion.button>
                </Link>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative h-72 w-60">
                  <motion.div
                    className="absolute left-1/2 top-2 h-28 w-28 -translate-x-1/2 rounded-full bg-[#111111]"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute left-1/2 top-24 h-40 w-44 -translate-x-1/2 rounded-[40px] bg-[#1F1F1F]"
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute left-1/2 top-14 h-16 w-16 -translate-x-1/2 rounded-full bg-white shadow-lg"
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img
                      src={LogoIconPixel}
                      alt="PixelBros"
                      className="h-full w-full rounded-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                  <motion.div
                    className="absolute left-6 top-36 h-20 w-20 rounded-2xl border border-[#F0E6E8] bg-white shadow-md"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute right-8 top-44 h-16 w-16 rounded-full border border-[#F0E6E8] bg-[#FFF1F3] shadow-md"
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default About;


