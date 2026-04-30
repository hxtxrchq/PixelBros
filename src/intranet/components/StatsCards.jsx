import { motion } from 'framer-motion';

const stats = [
  { label: 'Ventas del mes', value: '$ 12400', trend: '+18%', tone: 'from-[#e73c50]/25 to-transparent' },
  { label: 'Usuarios activos', value: '1250', trend: '+9%', tone: 'from-[#4f8cff]/20 to-transparent' },
  { label: 'Pedidos procesados', value: '320', trend: '+12%', tone: 'from-[#35c98f]/20 to-transparent' },
  { label: 'Mensajes pendientes', value: '87', trend: '-4%', tone: 'from-[#f5a524]/20 to-transparent' },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, idx) => (
        <motion.article
          key={stat.label}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: idx * 0.07 }}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-[0_12px_35px_rgba(0,0,0,0.28)]"
        >
          <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.tone}`} />
          <div className="relative flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{stat.label}</p>
              <p className="mt-1 text-3xl font-extrabold text-white">{stat.value}</p>
            </div>
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-1 text-xs font-bold text-white/90">{stat.trend}</span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
