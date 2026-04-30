import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LogoPixelBros from '../../images/LogoPixelBros.png';
import { useIntranet } from '../context/IntranetContext';

const items = [
  {
    label: 'Home',
    to: '/intranet/dashboard',
    icon: (
      <path d="M3 13h8V3H3v10zm10 8h8V3h-8v18zM3 21h8v-6H3v6z" />
    ),
  },
  {
    label: 'Usuarios',
    to: '/intranet/dashboard/usuarios',
    icon: (
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    ),
  },
  {
    label: 'Contenido',
    to: '/intranet/dashboard/contenido',
    icon: (
      <path d="M4 4h16v12H5.17L4 17.17V4zm3 3v2h10V7H7zm0 4v2h7v-2H7zM3 20h18v2H3z" />
    ),
    children: [
      { label: 'Agregar proyectos', to: '/intranet/dashboard/contenido/agregar' },
      { label: 'Lista de proyectos', to: '/intranet/dashboard/contenido/lista' },
    ],
  },
  {
    label: 'CRM',
    to: '/intranet/dashboard/crm',
    icon: (
      <path d="M5 4h11a2 2 0 0 1 2 2v14l-4-2-4 2-5-2V6a2 2 0 0 1 2-2zm9 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    ),
    children: [
      { label: 'Agregar cliente', to: '/intranet/dashboard/crm/perfil' },
      { label: 'Lista CRM', to: '/intranet/dashboard/crm/lista' },
    ],
  },
  {
    label: 'Cotizaciones',
    to: '/intranet/dashboard/cotizaciones',
    icon: (
      <path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm8 1v5h5" />
    ),
    children: [
      { label: 'Agregar cotizacion', to: '/intranet/dashboard/cotizaciones/agregar' },
      { label: 'Lista de cotizaciones', to: '/intranet/dashboard/cotizaciones/lista' },
    ],
  },
  {
    label: 'Kanban',
    to: '/intranet/dashboard/embudo',
    icon: (
      <path d="M3 4h18l-7 8v6l-4 2v-8L3 4z" />
    ),
  },
  {
    label: 'Requerimientos',
    to: '/intranet/dashboard/requerimientos',
    icon: (
      <path d="M7 2h10a2 2 0 0 1 2 2v18l-7-3-7 3V4a2 2 0 0 1 2-2zm2 5h6v2H9V7zm0 4h6v2H9v-2z" />
    ),
  },
  {
    label: 'Ventas',
    to: '/intranet/dashboard/ventas',
    icon: (
      <path d="M3 17h3v4H3v-4zm5-6h3v10H8V11zm5 3h3v7h-3v-7zm5-8h3v15h-3V6z" />
    ),
    children: [
      { label: 'Agregar venta', to: '/intranet/dashboard/ventas/agregar' },
      { label: 'Lista de ventas', to: '/intranet/dashboard/ventas/lista' },
    ],
  },
  {
    label: 'Reportes',
    to: '/intranet/dashboard/reportes',
    icon: (
      <path d="M4 20h16v2H2V4h2v16zm3-3V9h3v8H7zm5 0V5h3v12h-3zm5 0v-6h3v6h-3z" />
    ),
  },
  {
    label: 'Calendario',
    to: '/intranet/dashboard/calendario',
    icon: (
      <path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2zm13 8H4v10h16V10z" />
    ),
  },
];

const iconBase = 'h-5 w-5 flex-shrink-0 fill-current';

export default function Sidebar({ isOpen, onClose }) {
  const { theme } = useIntranet();
  const location = useLocation();
  const isDark = theme === 'dark';
  const [openMenus, setOpenMenus] = useState({});

  const isRouteActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  useEffect(() => {
    setOpenMenus((prev) => {
      const next = { ...prev };
      items.forEach((item) => {
        if (item.children && isRouteActive(item.to) && next[item.label] === undefined) {
          next[item.label] = true;
        }
      });
      return next;
    });
  }, [location.pathname]);

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !(prev[label] ?? false),
    }));
  };

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar menu"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/45 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-80 border-r p-6 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
          isDark ? 'border-white/10 bg-[#0f1230]' : 'border-slate-200 bg-white/95'
        } ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(circle_at_10%_20%,rgba(231,60,80,0.20),transparent_30%),radial-gradient(circle_at_90%_95%,rgba(138,125,255,0.20),transparent_40%)]'
              : 'bg-[radial-gradient(circle_at_10%_20%,rgba(231,60,80,0.08),transparent_30%),radial-gradient(circle_at_90%_95%,rgba(138,125,255,0.10),transparent_40%)]'
          }`}
        />

        <div className="relative flex h-full flex-col">
        <div className="mb-7 flex items-center justify-between">
          <Link to="/intranet/dashboard" className="inline-flex items-center" onClick={onClose}>
            <img src={LogoPixelBros} alt="PixelBros" className="h-16 w-auto" />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className={`rounded-md border p-2 lg:hidden ${
              isDark
                ? 'border-white/20 text-white/80 hover:border-white/40 hover:text-white'
                : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900'
            }`}
            aria-label="Cerrar sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        

        <nav className="sidebar-scroll flex-1 space-y-2.5 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <button
                  type="button"
                  onClick={() => toggleMenu(item.label)}
                  className={`group flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-[1.1rem] font-semibold tracking-[0.01em] transition-all ${
                    isRouteActive(item.to)
                      ? isDark
                        ? 'border-[#3b4678] bg-gradient-to-r from-[#20285a] to-[#1a2148] text-white shadow-[0_12px_30px_rgba(2,6,23,0.45)]'
                        : 'border-[#dce2ff] bg-[#eef2ff] text-[#101a45] shadow-[0_12px_28px_rgba(58,74,140,0.12)]'
                      : isDark
                        ? 'border-white/10 bg-white/[0.03] text-white/82 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className={iconBase}>
                    {item.icon}
                  </svg>
                  <span className="flex-1">{item.label}</span>
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition-transform ${openMenus[item.label] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              ) : (
                <NavLink
                  to={item.to}
                  end={item.to === '/intranet/dashboard'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl border px-4 py-3.5 text-[1.1rem] font-semibold tracking-[0.01em] transition-all ${
                      isActive || isRouteActive(item.to)
                        ? isDark
                          ? 'border-[#3b4678] bg-gradient-to-r from-[#20285a] to-[#1a2148] text-white shadow-[0_12px_30px_rgba(2,6,23,0.45)]'
                          : 'border-[#dce2ff] bg-[#eef2ff] text-[#101a45] shadow-[0_12px_28px_rgba(58,74,140,0.12)]'
                        : isDark
                          ? 'border-white/10 bg-white/[0.03] text-white/82 hover:border-white/25 hover:bg-white/[0.08] hover:text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <svg viewBox="0 0 24 24" className={iconBase}>
                    {item.icon}
                  </svg>
                  <span>{item.label}</span>
                </NavLink>
              )}

              {item.children && openMenus[item.label] && (
                <div className="mt-1.5 space-y-1.5 pl-7">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.to}
                      to={child.to}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium transition ${
                          isActive
                            ? isDark
                              ? 'bg-gradient-to-r from-[#e73c50]/30 via-[#8a7dff]/20 to-transparent text-[#ffe8ec]'
                              : 'bg-gradient-to-r from-[#ffe7eb] to-transparent text-[#9f2435]'
                            : isDark
                              ? 'text-white/68 hover:text-white'
                              : 'text-slate-600 hover:text-slate-900'
                        }`
                      }
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-white/35 group-hover:bg-white/70' : 'bg-slate-400 group-hover:bg-slate-700'}`} />
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        
        </div>
      </aside>
    </>
  );
}
