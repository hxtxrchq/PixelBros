
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './intranet/components/ProtectedRoute';

// Intranet imports
const IntranetLogin = lazy(() => import('./intranet/pages/Login'));
const IntranetDashboard = lazy(() => import('./intranet/pages/Dashboard'));
const IntranetHome = lazy(() => import('./intranet/pages/Home'));
const IntranetUsers = lazy(() => import('./intranet/pages/Users'));
const IntranetContent = lazy(() => import('./intranet/pages/Content'));
const IntranetCRM = lazy(() => import('./intranet/pages/CRM'));
const IntranetContentAdd = lazy(() => import('./intranet/pages/ContentAdd'));
const IntranetContentList = lazy(() => import('./intranet/pages/ContentList'));
const IntranetCRMProfile = lazy(() => import('./intranet/pages/CRMProfile'));
const IntranetCRMList = lazy(() => import('./intranet/pages/CRMList'));
const IntranetQuotes = lazy(() => import('./intranet/pages/Quotes'));
const IntranetQuotesAdd = lazy(() => import('./intranet/pages/QuotesAdd'));
const IntranetQuotesList = lazy(() => import('./intranet/pages/QuotesList'));
const IntranetPricing = lazy(() => import('./intranet/pages/Pricing'));
const IntranetPipeline = lazy(() => import('./intranet/pages/Pipeline'));
const IntranetRequests = lazy(() => import('./intranet/pages/Requests'));
const IntranetSalesBilling = lazy(() => import('./intranet/pages/SalesBilling'));
const IntranetSalesBillingAdd = lazy(() => import('./intranet/pages/SalesBillingAdd'));
const IntranetSalesBillingList = lazy(() => import('./intranet/pages/SalesBillingList'));
const IntranetReports = lazy(() => import('./intranet/pages/Reports'));
const IntranetCalendar = lazy(() => import('./intranet/pages/CommercialCalendar'));

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
          {/* Rutas públicas */}
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

          {/* Rutas de intranet (aisladas, no afectan el sitio público) */}
          <Route path="/intranet/login" element={<IntranetLogin />} />
          <Route
            path="/intranet/dashboard"
            element={
              <ProtectedRoute>
                <IntranetDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<IntranetHome />} />
            <Route path="usuarios" element={<IntranetUsers />} />
            <Route path="contenido" element={<IntranetContent />}>
              <Route index element={<IntranetContentAdd />} />
              <Route path="agregar" element={<IntranetContentAdd />} />
              <Route path="lista" element={<IntranetContentList />} />
            </Route>
            <Route path="crm" element={<IntranetCRM />}>
              <Route index element={<IntranetCRMProfile />} />
              <Route path="perfil" element={<IntranetCRMProfile />} />
              <Route path="lista" element={<IntranetCRMList />} />
            </Route>
            <Route path="cotizaciones" element={<IntranetQuotes />}>
              <Route index element={<IntranetQuotesAdd />} />
              <Route path="agregar" element={<IntranetQuotesAdd />} />
              <Route path="lista" element={<IntranetQuotesList />} />
            </Route>
            <Route path="precios" element={<IntranetPricing />} />
            <Route path="embudo" element={<IntranetPipeline />} />
            <Route path="requerimientos" element={<IntranetRequests />} />
            <Route path="ventas" element={<IntranetSalesBilling />}>
              <Route index element={<IntranetSalesBillingAdd />} />
              <Route path="agregar" element={<IntranetSalesBillingAdd />} />
              <Route path="lista" element={<IntranetSalesBillingList />} />
            </Route>
            <Route path="reportes" element={<IntranetReports />} />
            <Route path="calendario" element={<IntranetCalendar />} />
          </Route>
        </Routes>
      </AnimatePresence>
      </Suspense>
    </Router>
  );
}

export default App;
