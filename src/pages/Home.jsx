import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Hero from '../components/home/Hero';
import QuickAbout from '../components/home/QuickAbout';
import ServicesCarousel from '../components/home/ServicesCarousel';
import PortfolioSplitHero from '../components/home/PortfolioSplitHero';
import BrandsCascade from '../components/home/BrandsCascade';
import InitialLoading from '../components/InitialLoading';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const homeSchema = {
    "@context": "https://schema.org",
    "@type": "MarketingAgency",
    "name": "PixelBros",
    "alternateName": "PixelBros Publicidad",
    "url": "https://pixelbros.pe",
    "logo": "https://pixelbros.pe/favicon.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+51-959-212-496",
      "contactType": "sales",
      "email": "proyectos@pixelbros.pe",
      "areaServed": "PE",
      "availableLanguage": "Spanish"
    },
    "sameAs": [
      "https://www.facebook.com/PixelbrosMarketing/",
      "https://www.instagram.com/_pixelbros/",
      "https://www.linkedin.com/company/pixelbrospublicidad/"
    ],
    "description": "Agencia de marketing digital y publicidad en Lima, Perú. Estrategias creativas de branding, redes sociales y producción audiovisual.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "PE",
      "addressLocality": "Lima"
    }
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
      <SEO 
        title="PixelBros | Agencia de Marketing Digital y Publicidad en Perú"
        description="Agencia de marketing digital y publicidad en Lima, Perú. Especialistas en branding, manejo de redes sociales, producción audiovisual y diseño web."
        keywords="agencia de marketing digital peru, marketing digital lima, publicidad digital, productora audiovisual peru, agencia branding lima"
        schema={homeSchema}
      />
      <Hero />
      <div style={{
        height: '10rem',
        marginTop: '-10rem',
        background: 'linear-gradient(to bottom, transparent 0%, #06071a 65%)',
        pointerEvents: 'none',
        position: 'relative',
        zIndex: 10,
      }} />
      <QuickAbout />
      <ServicesCarousel />
      <div style={{ height: '6rem', background: '#06071a' }} />
      <PortfolioSplitHero />
      <BrandsCascade />
    </motion.div>
  );
};

export default Home;
