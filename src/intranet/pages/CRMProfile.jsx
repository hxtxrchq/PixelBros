import { useState } from 'react';
import { useIntranet } from '../context/IntranetContext';

const clientStatuses = ['Prospecto', 'Cliente activo', 'Cliente pausado', 'Cliente perdido'];
const leadSources = ['Referido', 'Instagram', 'Web', 'Evento', 'Networking', 'Otro'];
const serviceTypes = ['Social Media', 'Branding', 'Audiovisual', 'Fotografia', 'Menu digital', 'Otro'];

const emptyForm = {
  firstName: '',
  lastName: '',
  jobTitle: '',
  birthDate: '',
  companyName: '',
  businessSector: '',
  companyAnniversary: '',
  companySize: '',
  clientSince: '',
  contractEndDate: '',
  serviceType: serviceTypes[0],
  monthlyAmount: '',
  clientStatus: clientStatuses[0],
  leadSource: leadSources[0],
  meetingsHistory: '',
  quotesHistory: '',
  serviceChangesHistory: '',
};

const toFileNames = (fileList) => Array.from(fileList || []).map((file) => file.name);

export default function CRMProfile() {
  const { crmRecords, addCrmRecord } = useIntranet();
  const [form, setForm] = useState(emptyForm);
  const [contractFile, setContractFile] = useState('');
  const [proposalFile, setProposalFile] = useState('');
  const [otherDocuments, setOtherDocuments] = useState([]);

  const setValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetAll = () => {
    setForm(emptyForm);
    setContractFile('');
    setProposalFile('');
    setOtherDocuments([]);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.companyName.trim()) return;

    addCrmRecord({
      ...form,
      contractFile,
      proposalFile,
      otherDocuments,
    });

    resetAll();
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)] md:p-6">
      <h3 className="intranet-heading text-2xl font-black text-white">Perfil del cliente</h3>
      <p className="mt-1 text-sm text-white/65">Crea un nuevo perfil completo para clientes y prospectos.</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-6">
        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Nombre</span><input value={form.firstName} onChange={(e) => setValue('firstName', e.target.value)} required className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Apellidos</span><input value={form.lastName} onChange={(e) => setValue('lastName', e.target.value)} required className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Cargo en la empresa</span><input value={form.jobTitle} onChange={(e) => setValue('jobTitle', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Fecha de nacimiento</span><input type="date" value={form.birthDate} onChange={(e) => setValue('birthDate', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Nombre de la empresa</span><input value={form.companyName} onChange={(e) => setValue('companyName', e.target.value)} required className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Rubro</span><input value={form.businessSector} onChange={(e) => setValue('businessSector', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Fecha aniversario empresa</span><input type="date" value={form.companyAnniversary} onChange={(e) => setValue('companyAnniversary', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Tamano de empresa (opcional)</span><input value={form.companySize} onChange={(e) => setValue('companySize', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Fecha ingreso cliente</span><input type="date" value={form.clientSince} onChange={(e) => setValue('clientSince', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Fin estimado contrato</span><input type="date" value={form.contractEndDate} onChange={(e) => setValue('contractEndDate', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Tipo servicio adquirido</span><select value={form.serviceType} onChange={(e) => setValue('serviceType', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none">{serviceTypes.map((service) => (<option key={service} value={service}>{service}</option>))}</select></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Monto mensual</span><input type="number" min="0" value={form.monthlyAmount} onChange={(e) => setValue('monthlyAmount', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-2">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Estado cliente</span><select value={form.clientStatus} onChange={(e) => setValue('clientStatus', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none">{clientStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}</select></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Origen del cliente</span><select value={form.leadSource} onChange={(e) => setValue('leadSource', e.target.value)} className="w-full rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none">{leadSources.map((source) => (<option key={source} value={source}>{source}</option>))}</select></label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-3">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Contrato firmado (archivo)</span><input type="file" onChange={(e) => setContractFile(toFileNames(e.target.files)[0] || '')} className="w-full rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5 text-xs text-white/80" />{contractFile && <p className="text-xs text-white/65">{contractFile}</p>}</label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Propuesta enviada</span><input type="file" onChange={(e) => setProposalFile(toFileNames(e.target.files)[0] || '')} className="w-full rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5 text-xs text-white/80" />{proposalFile && <p className="text-xs text-white/65">{proposalFile}</p>}</label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Otros documentos</span><input type="file" multiple onChange={(e) => setOtherDocuments(toFileNames(e.target.files))} className="w-full rounded-xl border border-dashed border-white/25 bg-white/[0.02] p-2.5 text-xs text-white/80" />{otherDocuments.length > 0 && <p className="text-xs text-white/65">{otherDocuments.length} archivos</p>}</label>
        </div>

        <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:grid-cols-3">
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Historial: Reuniones</span><textarea value={form.meetingsHistory} onChange={(e) => setValue('meetingsHistory', e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Historial: Cotizaciones enviadas</span><textarea value={form.quotesHistory} onChange={(e) => setValue('quotesHistory', e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Historial: Cambios de servicio</span><textarea value={form.serviceChangesHistory} onChange={(e) => setValue('serviceChangesHistory', e.target.value)} rows={4} className="w-full resize-none rounded-xl border border-white/15 bg-[#090c22] px-3 py-2.5 text-sm text-white outline-none" /></label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2.5 text-sm font-black uppercase tracking-[0.08em] text-white">Guardar registro CRM</button>
          <button type="button" onClick={resetAll} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white/85">Limpiar</button>
          <span className="text-xs text-white/60">Registros actuales: {crmRecords.length}</span>
        </div>
      </form>
    </section>
  );
}
