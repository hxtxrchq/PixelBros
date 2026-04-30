import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';
import { contentClient } from '../services/contentClient';

const defaultContentRecords = [];

export default function Content() {
  const { theme } = useIntranet();
  const isDark = theme === 'dark';
  const [records, setRecords] = useState(defaultContentRecords);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadRecords = async () => {
    try {
      setIsLoading(true);
      setError('');
      const items = await contentClient.list();
      setRecords(items);
    } catch (loadError) {
      setError(loadError.message || 'No se pudo cargar contenido');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadRecords();
  }, []);

  return (
    <div className="space-y-6">
      <article className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-[#0d122d]/70' : 'border-slate-200 bg-white'}`}>
        <p className={`text-[11px] font-black uppercase tracking-[0.24em] ${isDark ? 'text-[#ff9eac]' : 'text-[#c93246]'}`}>Contenido</p>
        <h3 className={`intranet-heading mt-2 text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Subida de proyectos para la web</h3>
        <p className={`mt-2 text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Opciones de agregar y lista se muestran en el menu lateral para mantener la vista limpia.</p>
      </article>

      {error && (
        <p className={`rounded-xl border px-3 py-2 text-sm ${isDark ? 'border-[#e73c50]/40 bg-[#e73c50]/10 text-[#ffd2d8]' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {error}
        </p>
      )}

      <Outlet context={{ records, setRecords, isLoading, reloadRecords }} />
    </div>
  );
}
