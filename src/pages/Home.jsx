import { motion } from 'framer-motion';
import ServicesCarousel from '../components/home/ServicesCarousel';
import PortfolioSplitHero from '../components/home/PortfolioSplitHero';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <ServicesCarousel />
      <div style={{ height: '6rem', background: '#06071a' }} />
      <PortfolioSplitHero />
    </motion.div>
  );
};

export default Home;
