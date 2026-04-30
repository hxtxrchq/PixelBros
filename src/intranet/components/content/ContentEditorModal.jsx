import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const overlayAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const popupAnimation = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 18, scale: 0.98 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

const isVideoType = (mimeType = '', url = '') => {
  if (mimeType.toLowerCase().startsWith('video/')) return true;
  return /\.(mp4|mov|avi|webm|mkv|m4v)$/i.test(url);
};

const readableSize = (size) => {
  if (!size) return '0 KB';
  const kb = size / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

const toFilePreview = (file, kind) => ({
  id: `${kind}-${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
  name: file.name,
  type: file.type || '',
  size: file.size || 0,
  url: URL.createObjectURL(file),
  file,
});

const toExistingMedia = (media, kind) => ({
  id: media.id || `${kind}-${media.url}`,
  name: media.name || media.title || (kind === 'cover' ? 'Portada actual' : 'Archivo actual'),
  type: media.mimeType || media.type || '',
  url: media.url,
});

const baseFormFrom = (initialValues, categories) => ({
  companyName: initialValues?.companyName || '',
  title: initialValues?.title || '',
  category: initialValues?.category || categories[0] || 'Social Media',
  showOnHome: Boolean(initialValues?.showOnHome),
  showOnPortfolio: initialValues?.showOnPortfolio !== undefined ? Boolean(initialValues.showOnPortfolio) : true,
});

export default function ContentEditorModal({
  isOpen,
  mode,
  categories,
  initialValues,
  isSubmitting,
  error,
  onClose,
  onSubmit,
  inline = false,
}) {
  const [form, setForm] = useState(() => baseFormFrom(initialValues, categories));
  const [coverFilePreview, setCoverFilePreview] = useState(null);
  const [galleryFilePreviews, setGalleryFilePreviews] = useState([]);
  const [removedExistingMediaIds, setRemovedExistingMediaIds] = useState([]);
  const [activePreview, setActivePreview] = useState(null);

  const existingCover = useMemo(() => {
    if (!initialValues?.coverUrl) return null;
    return toExistingMedia(
      {
        id: initialValues.id,
        url: initialValues.coverUrl,
        mimeType: initialValues.coverMimeType,
        name: 'Portada actual',
      },
      'cover',
    );
  }, [initialValues]);

  const existingGallery = useMemo(() => {
    if (!Array.isArray(initialValues?.medias)) return [];
    return initialValues.medias.filter((media) => Boolean(media?.url)).map((media) => toExistingMedia(media, 'gallery'));
  }, [initialValues]);

  const resetEditorState = () => {
    setForm(baseFormFrom(initialValues, categories));
    setRemovedExistingMediaIds([]);
    setActivePreview(null);

    setCoverFilePreview((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return null;
    });

    setGalleryFilePreviews((prev) => {
      prev.forEach((item) => item?.url && URL.revokeObjectURL(item.url));
      return [];
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    resetEditorState();
  }, [isOpen, initialValues, categories]);

  useEffect(() => {
    return () => {
      if (coverFilePreview?.url) URL.revokeObjectURL(coverFilePreview.url);
      galleryFilePreviews.forEach((item) => item?.url && URL.revokeObjectURL(item.url));
    };
  }, [coverFilePreview, galleryFilePreviews]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFilePreview((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return toFilePreview(file, 'cover');
    });

    event.target.value = '';
  };

  const onGalleryChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    setGalleryFilePreviews((prev) => [...prev, ...files.map((file) => toFilePreview(file, 'gallery'))]);
    event.target.value = '';
  };

  const removeGalleryFile = (id) => {
    setGalleryFilePreviews((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((item) => item.id !== id);
    });
  };

  const toggleRemoveExistingMedia = (mediaId) => {
    setRemovedExistingMediaIds((prev) => (prev.includes(mediaId) ? prev.filter((id) => id !== mediaId) : [...prev, mediaId]));
  };

  const openPreview = (media, badge) => {
    setActivePreview({
      ...media,
      badge,
      kind: isVideoType(media.type, media.url) ? 'video' : 'image',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      coverFile: coverFilePreview?.file || null,
      galleryFiles: galleryFilePreviews.map((item) => item.file),
      removeMediaIds: removedExistingMediaIds,
    });
  };

  const topLabel = mode === 'create' ? 'Nuevo contenido' : 'Edicion de contenido';
  const titleText = mode === 'create' ? 'Agregar proyecto con vista previa interactiva' : 'Editar proyecto con portada y galeria';

  const editorSection = (
    <motion.section
      {...(inline ? {} : popupAnimation)}
      className={`${inline ? 'w-full rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_15%_15%,rgba(231,60,80,0.22),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(63,126,255,0.18),transparent_40%),#0b1028] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:p-7' : 'mx-auto w-full max-w-5xl rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_15%_15%,rgba(231,60,80,0.22),transparent_40%),radial-gradient(circle_at_85%_0%,rgba(63,126,255,0.18),transparent_40%),#0b1028] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.5)] md:p-7'}`}
    >
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">{topLabel}</p>
          <h3 className="intranet-heading mt-1 text-2xl font-black text-white md:text-[2rem]">{titleText}</h3>
          <p className="mt-1 text-sm text-white/65">Selecciona archivos y haz click en una miniatura para abrir el preview completo.</p>
        </div>

        {!inline && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/20 bg-white/[0.04] px-3 py-2 text-sm font-bold text-white/80 transition hover:border-white/45 hover:text-white"
          >
            Cerrar
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Empresa</span>
            <input
              value={form.companyName}
              onChange={(event) => onChange('companyName', event.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#e73c50]/70 focus:ring-2 focus:ring-[#e73c50]/30"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Titulo</span>
            <input
              value={form.title}
              onChange={(event) => onChange('title', event.target.value)}
              placeholder="Opcional"
              className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#e73c50]/70 focus:ring-2 focus:ring-[#e73c50]/30"
            />
          </label>

          <label className="space-y-1.5 md:col-span-2">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Categoria</span>
            <select
              value={form.category}
              onChange={(event) => onChange('category', event.target.value)}
              className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#e73c50]/70 focus:ring-2 focus:ring-[#e73c50]/30"
            >
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>

          <label className="inline-flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 md:col-span-1">
            <span className="text-sm font-bold text-white/85">Inicio</span>
            <input
              type="checkbox"
              checked={form.showOnHome}
              onChange={(event) => onChange('showOnHome', event.target.checked)}
              className="h-4 w-4 accent-[#e73c50]"
            />
          </label>

          <label className="inline-flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.03] px-3 py-2 md:col-span-1">
            <span className="text-sm font-bold text-white/85">Portafolio</span>
            <input
              type="checkbox"
              checked={form.showOnPortfolio}
              onChange={(event) => onChange('showOnPortfolio', event.target.checked)}
              className="h-4 w-4 accent-[#e73c50]"
            />
          </label>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff9eac]">Portada</p>
              <span className="rounded-full border border-[#ff9eac]/35 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#ffc1cb]">Portada</span>
            </div>

            <label className="mb-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/25 bg-[#090c22] px-3 py-2.5 text-xs text-white/80 transition hover:border-[#e73c50]/65">
              <span>Subir nueva portada</span>
              <input type="file" accept="image/*,video/*" onChange={onCoverChange} className="hidden" />
              <span className="rounded-lg border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">Elegir archivo</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              {existingCover && (
                <button type="button" onClick={() => openPreview(existingCover, 'Portada actual')} className="group overflow-hidden rounded-xl border border-white/10 bg-black/40 text-left">
                  {isVideoType(existingCover.type, existingCover.url) ? (
                    <video src={existingCover.url} className="h-24 w-full object-cover transition duration-300 group-hover:scale-[1.04]" muted />
                  ) : (
                    <img src={existingCover.url} alt={existingCover.name} className="h-24 w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
                  )}
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-white/75">Actual</p>
                </button>
              )}

              {coverFilePreview && (
                <button type="button" onClick={() => openPreview(coverFilePreview, 'Nueva portada')} className="group overflow-hidden rounded-xl border border-[#e73c50]/40 bg-black/40 text-left">
                  {isVideoType(coverFilePreview.type, coverFilePreview.url) ? (
                    <video src={coverFilePreview.url} className="h-24 w-full object-cover transition duration-300 group-hover:scale-[1.04]" muted />
                  ) : (
                    <img src={coverFilePreview.url} alt={coverFilePreview.name} className="h-24 w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
                  )}
                  <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-[#ffc2cc]">Nueva • {readableSize(coverFilePreview.size)}</p>
                </button>
              )}
            </div>

            {!existingCover && !coverFilePreview && <p className="text-xs text-white/55">Aun no hay portada seleccionada.</p>}
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#9bc2ff]">Galeria</p>
              <span className="rounded-full border border-[#9bc2ff]/35 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#bfd8ff]">{mode === 'edit' ? 'Gestion individual' : 'Multiples archivos'}</span>
            </div>

            <label className="mb-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-white/25 bg-[#090c22] px-3 py-2.5 text-xs text-white/80 transition hover:border-[#7ba7ff]/65">
              <span>{mode === 'edit' ? 'Agregar nueva galeria' : 'Agregar archivos a galeria'}</span>
              <input type="file" accept="image/*,video/*" multiple onChange={onGalleryChange} className="hidden" />
              <span className="rounded-lg border border-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em]">Elegir archivos</span>
            </label>

            <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
              {mode === 'edit' && existingGallery.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/50">Galeria actual ({existingGallery.length})</p>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {existingGallery.map((media) => {
                      const isMarked = removedExistingMediaIds.includes(media.id);
                      return (
                        <div key={media.id} className={`group relative overflow-hidden rounded-lg border bg-black/30 ${isMarked ? 'border-[#e73c50]/60 opacity-60' : 'border-white/10'}`}>
                          <button type="button" onClick={() => openPreview(media, 'Galeria actual')} className="block w-full">
                            {isVideoType(media.type, media.url) ? (
                              <video src={media.url} className="h-20 w-full object-cover transition duration-300 group-hover:scale-105" muted />
                            ) : (
                              <img src={media.url} alt={media.name} className="h-20 w-full object-cover transition duration-300 group-hover:scale-105" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleRemoveExistingMedia(media.id)}
                            className={`absolute right-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${isMarked ? 'bg-[#2f9f68]/90 text-white' : 'bg-black/70 text-white'}`}
                          >
                            {isMarked ? 'Restaurar' : 'Eliminar'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {removedExistingMediaIds.length > 0 && <p className="mt-1 text-[11px] text-[#ffb1bc]">{removedExistingMediaIds.length} archivo(s) se eliminaran al guardar.</p>}
                </div>
              )}

              {galleryFilePreviews.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9bc2ff]">Nueva galeria ({galleryFilePreviews.length})</p>
                  <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {galleryFilePreviews.map((media) => (
                      <div key={media.id} className="group relative overflow-hidden rounded-lg border border-[#7ba7ff]/35 bg-black/30">
                        <button type="button" onClick={() => openPreview(media, 'Nueva galeria')} className="block w-full">
                          {isVideoType(media.type, media.url) ? (
                            <video src={media.url} className="h-20 w-full object-cover transition duration-300 group-hover:scale-105" muted />
                          ) : (
                            <img src={media.url} alt={media.name} className="h-20 w-full object-cover transition duration-300 group-hover:scale-105" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeGalleryFile(media.id)}
                          className="absolute right-1 top-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-bold text-white"
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {existingGallery.length === 0 && galleryFilePreviews.length === 0 && <p className="text-xs text-white/55">Aun no hay archivos en la galeria.</p>}
            </div>
          </article>
        </div>

        {error && <p className="rounded-xl border border-[#e73c50]/40 bg-[#e73c50]/10 px-3 py-2 text-sm text-[#ffd2d8]">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:brightness-110 disabled:opacity-60"
          >
            {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear contenido' : 'Guardar cambios'}
          </button>
          <button
            type="button"
            onClick={() => {
              if (inline) {
                resetEditorState();
                return;
              }
              onClose();
            }}
            className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white/80 transition hover:border-white/45 hover:text-white"
          >
            {inline ? 'Limpiar' : 'Cancelar'}
          </button>
        </div>
      </form>
    </motion.section>
  );

  const showEditor = inline ? isOpen : Boolean(isOpen);

  return (
    <>
      {inline ? (
        showEditor ? editorSection : null
      ) : (
        <AnimatePresence>
          {showEditor ? (
            <motion.div className="fixed inset-0 z-[120]" {...overlayAnimation}>
              <div className="absolute inset-0 bg-[#050814]/85 backdrop-blur-md" onClick={onClose} />
              <div className="absolute inset-0 overflow-y-auto px-4 py-8 md:px-8">{editorSection}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}

      <AnimatePresence>
        {activePreview ? (
          <motion.div className="fixed inset-0 z-[130] p-4 md:p-8" {...overlayAnimation}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setActivePreview(null)} />
            <motion.div
              {...popupAnimation}
              className="relative mx-auto flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/20 bg-[#060a1f]"
            >
              <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#ffb1bc]">{activePreview.badge}</p>
                  <p className="max-w-[70vw] truncate text-sm font-semibold text-white/90">{activePreview.name}</p>
                </div>
                <button type="button" onClick={() => setActivePreview(null)} className="rounded-lg border border-white/20 px-2.5 py-1 text-xs font-bold text-white/80">
                  Cerrar
                </button>
              </header>

              <div className="flex-1 overflow-auto bg-black/35 p-3 md:p-6">
                {activePreview.kind === 'video' ? (
                  <video src={activePreview.url} controls className="mx-auto max-h-[72vh] w-auto max-w-full rounded-xl" />
                ) : (
                  <img src={activePreview.url} alt={activePreview.name} className="mx-auto max-h-[72vh] w-auto max-w-full rounded-xl" />
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
