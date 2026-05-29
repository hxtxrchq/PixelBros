import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickAbout = () => {
  return (
    <section className="bg-[#06071a] py-14 sm:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-12">
          <motion.h2
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="max-w-[11ch] text-4xl font-bold leading-[1.03] text-left text-white sm:text-5xl lg:col-span-5"
          >
            <span className="text-[#e73c50]">Rompemos</span> lo convencional
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="max-w-[58ch] text-justify text-base leading-relaxed text-neutral-300 sm:text-[1.25rem] lg:col-span-7"
          >
            Somos un estudio creativo que desafía los límites y transforma ideas en experiencias.
            Con más de 6 años construyendo campañas que dejan huella, conectando con audiencias de manera auténtica y disruptiva.
          </motion.p>

        </div>

        <div className="mt-10 flex justify-start lg:justify-end">
          <Link to="/contact">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(231,60,80,0.2)' }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#e73c50] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#c82d40] lg:mr-10"
            >
              Agenda una reunión
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default QuickAbout;

