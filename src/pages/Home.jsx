import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ServicesCarousel from '../components/home/ServicesCarousel';
import PortfolioSplitHero from '../components/home/PortfolioSplitHero';
import InitialLoading from '../components/InitialLoading';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <InitialLoading onComplete={handleLoadingComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Hero />
      <div style={{ height: '5rem', background: '#06071a' }} />
      <ServicesCarousel />
      <div style={{ height: '6rem', background: '#06071a' }} />
      <PortfolioSplitHero />
    </motion.div>
  );
};

export default Home;
