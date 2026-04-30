import { useMemo, useState } from 'react';

const categories = [
  'Social Media',
  'Branding',
  'Audiovisual',
  'Fotografia',
  'Menu digital',
  'Diseno de identidad visual',
  'Otro',
];

const toMediaItems = (fileList) =>
  Array.from(fileList).map((file) => ({
    name: file.name,
    type: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
  }));

const readableSize = (size) => {
  if (!size) return '0 KB';
  const kb = size / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export default function ProjectManagerPanel() {
  const [form, setForm] = useState({
    companyName: '',
    category: categories[0],
    showOnHome: false,
    showOnPortfolio: true,
  });

  const [coverMedia, setCoverMedia] = useState(null);
  const [galleryMedia, setGalleryMedia] = useState([]);
  const [projects, setProjects] = useState([]);

  const totalUploadedMedia = useMemo(() => {
    return projects.reduce((acc, project) => acc + project.media.length + (project.cover ? 1 : 0), 0);
  }, [projects]);

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (coverMedia?.url) URL.revokeObjectURL(coverMedia.url);

    const [item] = toMediaItems([file]);
    setCoverMedia(item);
    event.target.value = '';
  };

  const onGalleryChange = (event) => {
    const files = event.target.files;
    if (!files?.length) return;

    const incoming = toMediaItems(files);
    setGalleryMedia((prev) => [...prev, ...incoming]);
    event.target.value = '';
  };

  const removeGalleryItem = (index) => {
    setGalleryMedia((prev) => {
      const target = prev[index];
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    setForm({
      companyName: '',
      category: categories[0],
      showOnHome: false,
      showOnPortfolio: true,
    });

    if (coverMedia?.url) URL.revokeObjectURL(coverMedia.url);
    galleryMedia.forEach((item) => item?.url && URL.revokeObjectURL(item.url));

    setCoverMedia(null);
    setGalleryMedia([]);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (!form.companyName.trim() || !coverMedia) return;

    const project = {
      id: Date.now(),
      companyName: form.companyName.trim(),
      category: form.category,
      showOnHome: form.showOnHome,
      showOnPortfolio: form.showOnPortfolio,
      cover: coverMedia,
      media: galleryMedia,
      createdAt: new Date().toLocaleString('es-PE'),
    };

    setProjects((prev) => [project, ...prev]);
    resetForm();
  };

  return (
    <section className="space-y-6">
      <article className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)] md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff9eac]">Contenido web</p>
            <h3 className="intranet-heading text-2xl font-black text-white">Gestor de proyectos</h3>
            <p className="mt-1 text-sm text-white/70">Carga portada y multiples archivos para cada empresa. Todo es frontend por ahora.</p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/55">Registros</p>
            <p className="text-xl font-black text-white">{projects.length}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-sm font-bold uppercase tracking-[0.08em] text-white/85">Empresa</span>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => onFormChange('companyName', e.target.value)}
                placeholder="Ej. GMS Peru"
                className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e73c50]/65 focus:ring-2 focus:ring-[#e73c50]/30"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-bold uppercase tracking-[0.08em] text-white/85">Categoria</span>
              <select
                value={form.category}
                onChange={(e) => onFormChange('category', e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none transition focus:border-[#e73c50]/65 focus:ring-2 focus:ring-[#e73c50]/30"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="block text-sm font-bold uppercase tracking-[0.08em] text-white/85">Portada (imagen o video)</span>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={onCoverChange}
                className="w-full rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5 text-xs text-white/80"
              />
            </label>

            <label className="space-y-1.5">
              <span className="block text-sm font-bold uppercase tracking-[0.08em] text-white/85">Galeria de proyecto (multiples)</span>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={onGalleryChange}
                className="w-full rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5 text-xs text-white/80"
              />
            </label>
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-2">
            <label className="inline-flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-sm font-bold text-white/85">Mostrar en Inicio</span>
              <input
                type="checkbox"
                checked={form.showOnHome}
                onChange={(e) => onFormChange('showOnHome', e.target.checked)}
                className="h-4 w-4 accent-[#e73c50]"
              />
            </label>

            <label className="inline-flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
              <span className="text-sm font-bold text-white/85">Mostrar en Portafolio</span>
              <input
                type="checkbox"
                checked={form.showOnPortfolio}
                onChange={(e) => onFormChange('showOnPortfolio', e.target.checked)}
                className="h-4 w-4 accent-[#e73c50]"
              />
            </label>
          </div>

          {coverMedia && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff9eac]">Preview portada</p>
              <div className="overflow-hidden rounded-lg border border-white/10 bg-black/40">
                {coverMedia.type.startsWith('video') ? (
                  <video src={coverMedia.url} className="h-48 w-full object-cover" controls muted />
                ) : (
                  <img src={coverMedia.url} alt={coverMedia.name} className="h-48 w-full object-cover" />
                )}
              </div>
              <p className="mt-2 text-xs text-white/65">{coverMedia.name} • {readableSize(coverMedia.size)}</p>
            </div>
          )}

          {galleryMedia.length > 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <p className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#ff9eac]">Galeria cargada ({galleryMedia.length})</p>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {galleryMedia.map((item, index) => (
                  <div key={`${item.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
                    {item.type.startsWith('video') ? (
                      <video src={item.url} className="h-28 w-full object-cover" muted />
                    ) : (
                      <img src={item.url} alt={item.name} className="h-28 w-full object-cover" />
                    )}

                    <button
                      type="button"
                      onClick={() => removeGalleryItem(index)}
                      className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white transition hover:brightness-110"
            >
              Guardar proyecto
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white/85 transition hover:border-white/40 hover:text-white"
            >
              Limpiar formulario
            </button>

            <span className="text-xs text-white/65">Permite cargar muchos archivos desde frontend.</span>
          </div>
        </form>
      </article>

      <article className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)] md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#ff9eac]">Vista previa de configuracion</p>
            <h3 className="intranet-heading text-2xl font-black text-white">Proyectos registrados</h3>
          </div>
          <span className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs font-bold text-white/75">Media total: {totalUploadedMedia}</span>
        </div>

        {projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-white/20 bg-white/[0.02] p-4 text-sm text-white/60">Aun no hay proyectos creados en la sesion.</p>
        ) : (
          <div className="grid gap-3">
            {projects.map((project) => (
              <div key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-black text-white">{project.companyName}</h4>
                    <p className="text-xs text-white/60">{project.category} • {project.createdAt}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    <span className={`rounded-full px-2 py-1 ${project.showOnHome ? 'bg-[#e73c50]/20 text-[#ff9aa6]' : 'bg-white/10 text-white/65'}`}>
                      Inicio: {project.showOnHome ? 'Si' : 'No'}
                    </span>
                    <span className={`rounded-full px-2 py-1 ${project.showOnPortfolio ? 'bg-[#4f8cff]/20 text-[#8fb3ff]' : 'bg-white/10 text-white/65'}`}>
                      Portafolio: {project.showOnPortfolio ? 'Si' : 'No'}
                    </span>
                  </div>
                </div>

                <p className="mt-2 text-sm text-white/70">Archivos asociados: {project.media.length + (project.cover ? 1 : 0)}</p>
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
