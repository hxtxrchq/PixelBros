import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useIntranet } from '../context/IntranetContext';

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useIntranet();
  const isDark = theme === 'dark';

  return (
    <div
      data-theme={theme}
      className={`intranet-shell relative min-h-screen overflow-hidden ${
        isDark ? 'bg-[#070b1e] text-slate-100' : 'bg-[#eef2ff] text-[#0f172a]'
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isDark
            ? 'bg-[radial-gradient(circle_at_10%_8%,rgba(231,60,80,0.20),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(108,132,255,0.16),transparent_35%),linear-gradient(180deg,#070b1e_0%,#0a0f2a_58%,#070b1e_100%)]'
            : 'bg-[radial-gradient(circle_at_12%_18%,rgba(231,60,80,0.10),transparent_30%),radial-gradient(circle_at_88%_0%,rgba(98,96,184,0.12),transparent_34%),linear-gradient(180deg,#eef2ff_0%,#f8fafc_52%,#eef2ff_100%)]'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-0 [background-size:34px_34px] ${
          isDark
            ? 'opacity-[0.16] [background-image:linear-gradient(rgba(231,236,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(231,236,255,0.08)_1px,transparent_1px)]'
            : 'opacity-[0.28] [background-image:linear-gradient(rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.06)_1px,transparent_1px)]'
        }`}
      />

      <div className="relative flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col lg:pl-80">
          <Header onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />
          <main className="intranet-main flex-1 p-4 md:p-6 xl:p-8">
            <div className="mx-auto w-full max-w-[1500px]">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
