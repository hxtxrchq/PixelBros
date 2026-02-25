import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
const LogoPixelBros = 'https://res.cloudinary.com/dhhd92sgr/image/upload/pixelbros/logos/LogoPixelBros.png';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Quiénes Somos', path: '/about' },
    { name: 'Portafolio', path: '/portfolio' },
    { name: 'Servicios', path: '/services' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navbar-root fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#06071a]/95 backdrop-blur-lg shadow-[0_8px_28px_rgba(0,0,8,0.50)]'
          : 'bg-transparent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.img
              src={LogoPixelBros}
              alt="PixelBros"
              className="h-12 w-auto"
              whileHover={{ scale: 1.05 }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <span
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#E93556]'
                      : isScrolled
                        ? 'text-white/85 hover:text-[#e73c50]'
                        : 'text-white/85 hover:text-[#ffd6e0]'
                  }`}
                >
                  {link.name}
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E93556]"
                  initial={{ scaleX: 0 }}
                  animate={{
                    scaleX: location.pathname === link.path ? 1 : 0,
                  }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
            
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 8px 20px rgba(231,60,80,0.30)' }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-2.5 bg-[#e73c50] text-white font-bold rounded-full text-sm tracking-wide transition-all hover:bg-[#c82d40]"
              >
                Contacto
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden focus:outline-none transition-colors ${
              isScrolled ? 'text-white' : 'text-white'
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#06071a]/97 backdrop-blur-lg"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-2 text-lg font-semibold transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#E93556]'
                      : 'text-white/80 hover:text-[#e73c50]'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <button className="w-full px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full">
                  Contacto
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
