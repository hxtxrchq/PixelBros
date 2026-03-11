import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ServicesCarousel from '../components/home/ServicesCarousel';
import PortfolioSplitHero from '../components/home/PortfolioSplitHero';
import InitialLoading from '../components/InitialLoading';

const Home = () => {
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('pb-home-loader-seen') !== '1';
  });

  const handleLoadingComplete = () => {
    sessionStorage.setItem('pb-home-loader-seen', '1');
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
      <div style={{
        height: '10rem',
        marginTop: '-10rem',
        background: 'linear-gradient(to bottom, transparent 0%, #06071a 65%)',
        pointerEvents: 'none',
        position: 'relative',
        zIndex: 10,
      }} />
      <ServicesCarousel />
      <div style={{ height: '6rem', background: '#06071a' }} />
      <PortfolioSplitHero />
    </motion.div>
  );
};

export default Home;
