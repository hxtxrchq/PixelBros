import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SvgIcon from './SvgIcon';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services/${service.slug}`}>
      <motion.div
        className="group relative h-full bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#e73c50] transition-all duration-300"
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Gradient Overlay */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Card Content */}
        <div className="relative p-8 h-full flex flex-col">
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-lg bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-6 shadow-lg`}
            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <SvgIcon
              path={service.iconPath}
              className="w-8 h-8 text-white"
            />
          </motion.div>

          {/* Title */}
          <h3 className="text-2xl font-display font-bold mb-3 text-white group-hover:text-[#e73c50] transition-colors duration-300">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-white/60 mb-6 flex-grow group-hover:text-white/85 transition-colors duration-300 leading-relaxed">
            {service.description}
          </p>

          {/* Hover Arrow */}
          <motion.div
            className="flex items-center text-[#B3262E] font-semibold text-sm"
            initial={{ x: 0, opacity: 0 }}
            whileHover={{ x: 5, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="mr-2">Conocer más</span>
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="transform group-hover:translate-x-1 transition-transform"
            >
              <path
                d="M4 10h12m0 0l-4-4m4 4l-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 60px rgba(179, 38, 46, 0.12), 0 0 30px rgba(179, 38, 46, 0.2)',
          }}
        />
      </motion.div>
    </Link>
  );
};

export default ServiceCard;
