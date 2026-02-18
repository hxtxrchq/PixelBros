import { useState } from 'react';
import { motion } from 'framer-motion';
import Hero from '../components/home/Hero';
import ServicesSection from '../components/home/ServicesSection';
import PortfolioPreview from '../components/home/PortfolioPreview';
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
      <ServicesSection />
      <PortfolioPreview />
    </motion.div>
  );
};

export default Home;
