import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import ContentEditorModal from '../components/content/ContentEditorModal';
import { contentClient } from '../services/contentClient';
import { clearPublicContentCache } from '../../services/publicContentClient';

const categories = [
  'Social Media',
  'Branding',
  'Audiovisual',
  'Fotografia',
  'Menu digital',
  'Diseño de identidad visual',
  'Otro',
];

const toSummaryRecord = (item) => ({
  id: item.id,
  companyName: item.companyName,
  title: item.title,
  slug: item.slug,
  category: item.category,
  showOnHome: item.showOnHome,
  showOnPortfolio: item.showOnPortfolio,
  coverUrl: item.coverUrl,
  coverMimeType: item.coverMimeType,
  logoUrl: item.logoUrl,
  logoMimeType: item.logoMimeType,
  logoLabel: item.logoLabel,
  galleryCount: item.galleryCount,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
});

export default function ContentList() {
  const navigate = useNavigate();
  const { records, setRecords, isLoading } = useOutletContext();
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetailId, setIsLoadingDetailId] = useState(null);

  const onDelete = async (id) => {
    try {
      setError('');
      await contentClient.remove(id);
      clearPublicContentCache();
      setRecords((prev) => prev.filter((item) => item.id !== id));
    } catch (deleteError) {
      setError(deleteError.message || 'No se pudo eliminar el registro');
    }
  };

  const onEdit = async (item) => {
    try {
      setError('');
      setIsLoadingDetailId(item.id);
      // Open immediately with the lightweight summary to keep UI snappy.
      setEditingItem(item);
      const detailedItem = await contentClient.getById(item.id);
      setEditingItem((prev) => {
        if (!prev || prev.id !== item.id) return prev;
        return {
          ...detailedItem,
          coverUrl: detailedItem.coverUrl ?? prev.coverUrl,
          coverMimeType: detailedItem.coverMimeType ?? prev.coverMimeType,
          logoUrl: detailedItem.logoUrl ?? prev.logoUrl,
          logoMimeType: detailedItem.logoMimeType ?? prev.logoMimeType,
        };
      });
    } catch (detailError) {
      setError(detailError.message || 'No se pudo cargar el detalle del contenido');
    } finally {
      setIsLoadingDetailId(null);
    }
  };

  const saveEdit = async (payload) => {
    if (!editingItem?.id) return;
    try {
      setIsSubmitting(true);
      setError('');
      const updated = await contentClient.update(editingItem.id, payload);
      clearPublicContentCache();
      setRecords((prev) => prev.map((item) => (item.id === editingItem.id ? toSummaryRecord(updated) : item)));
      setEditingItem(null);
    } catch (updateError) {
      setError(updateError.message || 'No se pudo actualizar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="intranet-heading text-2xl font-black text-white">Lista completa de contenido</h3>
        <button
          type="button"
          onClick={() => navigate('/intranet/dashboard/contenido/agregar')}
          className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-bold text-white"
        >
          Agregar proyecto
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 p-3 text-sm text-[#ffd2d8]">{error}</p>
      )}

      {isLoading ? (
        <p className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-sm text-white/65">Cargando contenido...</p>
      ) : records.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-sm text-white/65">No hay registros de contenido todavía.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {records.map((item) => {
            const mediaCount = Number(item.galleryCount || 0) + (item.coverUrl ? 1 : 0);
            return (
              <article
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_12px_26px_rgba(0,0,0,0.22)] transition hover:-translate-y-0.5 hover:border-white/25"
                style={{ contentVisibility: 'auto', containIntrinsicSize: '260px 420px' }}
              >
              <div className="relative h-36 bg-black/35">
                  {item.coverUrl ? (
                    item.coverMimeType?.startsWith('video/') ? (
                      <div className="flex h-full w-full items-center justify-center bg-black/55 text-[11px] font-black uppercase tracking-[0.14em] text-white/65">
                        Portada video
                      </div>
                    ) : (
                      <img
                        src={item.coverUrl}
                        alt={item.companyName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                      />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs font-bold uppercase tracking-[0.12em] text-white/45">Sin portada</div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-200 group-hover:opacity-45" />

                  <div className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white/80">
                    {(() => {
                      if (!item.logoUrl) return item.category;
                      return (
                        <span className="inline-flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center">
                            <img
                              src={item.logoUrl}
                              alt="Logo"
                              className="h-6 w-6 object-contain opacity-95 [filter:brightness(0)_invert(1)] drop-shadow-[0_4px_14px_rgba(255,255,255,0.2)]"
                              loading="lazy"
                              decoding="async"
                              fetchPriority="low"
                              onError={(event) => {
                                event.currentTarget.style.display = 'none';
                              }}
                            />
                          </span>
                          <span>{item.category}</span>
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h4 className="truncate text-base font-black text-white">{item.companyName}</h4>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.08em]">
                    <span className={`rounded-full px-2 py-1 ${item.showOnHome ? 'bg-[#e73c50]/20 text-[#ffadb8]' : 'bg-white/10 text-white/55'}`}>
                      Inicio: {item.showOnHome ? 'Sí' : 'No'}
                    </span>
                    <span className={`rounded-full px-2 py-1 ${item.showOnPortfolio ? 'bg-[#4f8cff]/20 text-[#a8c5ff]' : 'bg-white/10 text-white/55'}`}>
                      Portafolio: {item.showOnPortfolio ? 'Sí' : 'No'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Archivos: {mediaCount}</span>
                    <span>{new Date(item.createdAt).toLocaleDateString('es-PE')}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      disabled={isLoadingDetailId === item.id}
                      className="flex-1 rounded-lg border border-white/20 px-2 py-1.5 text-xs font-bold text-white/85 transition hover:border-white/45"
                    >
                      {isLoadingDetailId === item.id ? 'Cargando...' : 'Editar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item.id)}
                      className="flex-1 rounded-lg border border-[#e73c50]/45 px-2 py-1.5 text-xs font-bold text-[#ffb1bc] transition hover:bg-[#e73c50]/10"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ContentEditorModal
        isOpen={Boolean(editingItem)}
        mode="edit"
        categories={categories}
        initialValues={editingItem}
        isSubmitting={isSubmitting}
        error={error}
        onClose={() => setEditingItem(null)}
        onSubmit={saveEdit}
      />
    </section>
  );
}
