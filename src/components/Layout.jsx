import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(255, 241, 243, 0.7) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(255, 241, 243, 0.6) 0%, transparent 60%), radial-gradient(circle at 70% 85%, rgba(255, 241, 243, 0.55) 0%, transparent 55%)',
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-60"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          style={{ willChange: 'opacity' }}
        >
          <defs>
            <filter id="layoutGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M -100 220 C 120 120, 260 320, 520 220 S 980 260, 1120 420"
            stroke="#F25C66"
            strokeWidth="2"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -120 620 C 200 520, 420 700, 760 600 S 1120 640, 1180 760"
            stroke="#FF7A3C"
            strokeWidth="2"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -50 80 Q 300 150, 600 80 T 1050 80"
            stroke="#F25C66"
            strokeWidth="1.5"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -80 900 Q 250 850, 550 900 T 1080 900"
            stroke="#A855F7"
            strokeWidth="1.5"
            fill="none"
            filter="url(#layoutGlow)"
          />
        </svg>
      </div>

      <Navbar />
      <main className="flex-grow relative">
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
