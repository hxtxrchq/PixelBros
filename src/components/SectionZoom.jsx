import { motion } from 'framer-motion';

const SectionZoom = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.72 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.92, ease: [0.12, 1, 0.28, 1], delay }}
      style={{ transformOrigin: 'center center' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SectionZoom;