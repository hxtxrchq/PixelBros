import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#1a1c52]">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, #1a1c52 0%, #1e2068 50%, #16183f 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 15% 16%, rgba(231, 60, 80, 0.10) 0%, transparent 46%), radial-gradient(circle at 84% 24%, rgba(90, 179, 229, 0.08) 0%, transparent 48%), radial-gradient(circle at 74% 86%, rgba(71, 65, 146, 0.20) 0%, transparent 45%)',
          }}
        />
        <svg
          className="absolute inset-0 w-full h-full opacity-40"
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
            stroke="rgba(231,60,80,0.4)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -120 620 C 200 520, 420 700, 760 600 S 1120 640, 1180 760"
            stroke="rgba(90,179,229,0.3)"
            strokeWidth="1.5"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -50 80 Q 300 150, 600 80 T 1050 80"
            stroke="rgba(231,60,80,0.25)"
            strokeWidth="1"
            fill="none"
            filter="url(#layoutGlow)"
          />
          <path
            d="M -80 900 Q 250 850, 550 900 T 1080 900"
            stroke="rgba(71,65,146,0.35)"
            strokeWidth="1"
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
