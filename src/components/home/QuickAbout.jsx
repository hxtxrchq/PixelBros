import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const METRICS = [
  {
    title: 'Trayectoria con proposito',
    value: '+5 años',
    description: 'Mas de cinco años creando soluciones que conectan diseno, estrategia y tecnologia.',
    bg: 'bg-[#e73c50]',
  },
  {
    title: 'Confianza que crece',
    value: '+100 Clientes',
    description: 'Marcas que confiaron en nosotros para transformar ideas en resultados medibles.',
    bg: 'bg-[#4a479a]',
  },
  {
    title: 'Ideas en movimiento',
    value: '+500 Reuniones',
    description: 'Cada reunion nos acerca a mejores decisiones, soluciones y proyectos.',
    bg: 'bg-[#cf4a1f]',
  },
];

const QuickAbout = () => {
  return (
    <section className="bg-[#06071a] py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-[12ch] text-4xl font-bold leading-[1.03] text-white sm:text-5xl"
          >
            <span className="text-[#e73c50]">Rompemos</span> lo convencional.
          </motion.h2>
          <motion.p
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.55, delay: 0.05 }}
  className="max-w-[54ch] text-base leading-relaxed text-neutral-300 sm:text-[1.25rem]"
>
  Somos un estudio creativo que desafia los limites y transforma ideas en experiencias.
  Nos apasiona construir campanas que dejan huella, conectando con audiencias de manera autentica y disruptiva.
</motion.p>

        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {METRICS.slice(0, 2).map((item, idx) => (
            <motion.article
              key={item.value}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.06 * idx }}
              className={`${item.bg} rounded-3xl p-6 text-white sm:p-8 lg:col-span-6`}
            >
              <p className="text-sm font-semibold text-white/90">{item.title}</p>
              <h3 className="mt-3 text-4xl font-bold sm:text-5xl">{item.value}</h3>
              <p className="mt-4 max-w-[34ch] text-sm text-white/90 sm:text-base">{item.description}</p>
            </motion.article>
          ))}

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className={`${METRICS[2].bg} rounded-3xl p-6 text-white sm:p-8 lg:col-span-7`}
          >
            <p className="text-sm font-semibold text-white/90">{METRICS[2].title}</p>
            <h3 className="mt-3 text-4xl font-bold sm:text-5xl">{METRICS[2].value}</h3>
            <p className="mt-4 max-w-[34ch] text-sm text-white/90 sm:text-base">{METRICS[2].description}</p>
          </motion.article>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:col-span-5 flex flex-col items-start justify-center"
          >
            <p className="text-3xl font-bold text-white">+50 clientes contentos</p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 text-base font-semibold text-[#070916] transition hover:bg-white/90"
            >
              Cotiza con nosotros
              <span aria-hidden="true">↗</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuickAbout;

