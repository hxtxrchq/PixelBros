import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

const Home           = lazy(() => import('./pages/Home'));
const About          = lazy(() => import('./pages/About'));
const Portfolio      = lazy(() => import('./pages/Portfolio'));
const PortfolioDetail = lazy(() => import('./pages/PortfolioDetail'));
const Services       = lazy(() => import('./pages/Services'));
const ServiceDetail  = lazy(() => import('./pages/ServiceDetail'));
const Contact        = lazy(() => import('./pages/Contact'));
const Apply          = lazy(() => import('./pages/Apply'));

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={null}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="portfolio/:slug" element={<PortfolioDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetail />} />
            <Route path="contact" element={<Contact />} />
            <Route path="postula" element={<Apply />} />
          </Route>
        </Routes>
      </AnimatePresence>
      </Suspense>
    </Router>
  );
}

export default App;
