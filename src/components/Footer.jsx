import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
const pixelBrosLogo = 'https://res.cloudinary.com/dhhd92sgr/image/upload/pixelbros/logos/LogoPixelBros.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'Instagram', 
      url: 'https://www.instagram.com/_pixelbros/',
      iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    },
    { 
      name: 'Facebook', 
      url: 'https://www.facebook.com/PixelbrosMarketing/?locale=es_LA',
      iconPath: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    },
    { 
      name: 'Linkedin', 
      url: 'https://www.linkedin.com/company/pixelbrospublicidad/?originalSubdomain=pe',
      iconPath: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
    },
    { 
      name: 'WhatsApp', 
      url: '+51959212496',
      iconPath: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z'
    },
  ];

  const quickLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Quiénes Somos', path: '/about' },
    { name: 'Servicios', path: '/services' },
    { name: 'Portafolio', path: '/portfolio' },
    { name: 'Contacto', path: '/contact' },
  ];

  return (
    <footer className="footer-root mt-16 bg-[#06071a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[2rem] p-8 sm:p-10 bg-[#0d0e24] text-center mb-12 overflow-hidden relative"
        >
          <div className="absolute inset-0 pb-pattern-rings opacity-20" />
          <h3 className="relative text-3xl md:text-5xl mb-2 text-white">
            Let&apos;s love
            <br />
            make a mark
          </h3>
          <p className="relative text-white/85 mb-8 font-medium">
            Síguenos y conversemos sobre tu proyecto.
          </p>

          <div className="relative flex justify-center gap-4 flex-wrap">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.15, y: -5 }}
                className="group relative w-14 h-14 bg-white/10 hover:bg-white rounded-xl flex items-center justify-center shadow-md transition-all duration-300"
              >
                <svg
                  className="w-6 h-6 text-white group-hover:text-[#E93556] transition-colors duration-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d={social.iconPath} />
                </svg>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src={pixelBrosLogo}
                alt="PixelBros"
                className="h-10 w-auto"
                loading="lazy"
              />
            </Link>
            <p className="text-white/60 mb-5 leading-relaxed text-sm">
              Branding, social media y producción audiovisual.
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(179, 38, 46, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-[#e73c50] text-white font-bold rounded-full text-sm hover:bg-[#c82d40] transition-colors"
              >
                Agenda una Llamada
              </motion.button>
            </Link>
          </div>

          <div>
            <h4 className="text-xl mb-4 text-white">Enlaces</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-[#e73c50] transition-colors inline-flex items-center group"
                  >
                    <span className="mr-2 group-hover:mr-3 transition-all">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl mb-4 text-white">Contacto</h4>
            <ul className="space-y-3 text-white/60 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#E93556] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:pixelbrosperu@outlook.com" className="hover:text-[#E93556] transition-colors">
                  pixelbrosperu@outlook.com
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#E93556] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+51959212496" className="hover:text-[#E93556] transition-colors">
                  +51 959 212 496
                </a>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-3 text-[#E93556] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Perú</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-white/40 text-xs sm:text-sm">
            © {currentYear} PixelBros. Todos los derechos reservados. 
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


