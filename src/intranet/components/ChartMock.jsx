export default function ChartMock() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f38e9b]">Rendimiento</p>
            <h3 className="text-lg font-extrabold text-white">Ventas semanales</h3>
          </div>
          <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-bold text-white/80">Mock data</span>
        </div>

        <div className="h-64 w-full">
          <svg width="100%" height="100%" viewBox="0 0 640 260" role="img" aria-label="Grafico de ventas">
            <defs>
              <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#e73c50" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e73c50" stopOpacity="0.12" />
              </linearGradient>
            </defs>

            <g stroke="rgba(255,255,255,0.12)" strokeDasharray="6 8">
              <line x1="30" y1="40" x2="610" y2="40" />
              <line x1="30" y1="90" x2="610" y2="90" />
              <line x1="30" y1="140" x2="610" y2="140" />
              <line x1="30" y1="190" x2="610" y2="190" />
            </g>

            <path d="M40 195 C95 170, 125 132, 182 138 C244 146, 286 90, 346 102 C404 113, 445 84, 506 94 C552 101, 578 70, 610 74" fill="none" stroke="#e73c50" strokeWidth="4" strokeLinecap="round" />
            <path d="M40 195 C95 170, 125 132, 182 138 C244 146, 286 90, 346 102 C404 113, 445 84, 506 94 C552 101, 578 70, 610 74 L610 230 L40 230 Z" fill="url(#lineGradient)" />

            <g fill="#ffffffa8" fontSize="12" fontWeight="600">
              <text x="40" y="245">Lun</text>
              <text x="130" y="245">Mar</text>
              <text x="220" y="245">Mie</text>
              <text x="310" y="245">Jue</text>
              <text x="400" y="245">Vie</text>
              <text x="490" y="245">Sab</text>
              <text x="580" y="245">Dom</text>
            </g>
          </svg>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f38e9b]">Actividad</p>
        <h3 className="mt-1 text-lg font-extrabold text-white">Ultimos mensajes</h3>

        <ul className="mt-5 space-y-3">
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-semibold text-white">Nuevo lead en formulario</p>
            <p className="text-xs text-white/60">Hace 12 min</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-semibold text-white">Solicitud de propuesta</p>
            <p className="text-xs text-white/60">Hace 36 min</p>
          </li>
          <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm font-semibold text-white">Actualizacion de portafolio</p>
            <p className="text-xs text-white/60">Hace 1 h</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
