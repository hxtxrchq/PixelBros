import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntranet } from '../context/IntranetContext';

const statuses = ['Prospecto', 'Cliente activo', 'Cliente pausado', 'Cliente perdido'];

const money = (amount) => {
  const n = Number(amount);
  if (Number.isNaN(n)) return 'S/ 0';
  return `S/ ${n.toLocaleString('es-PE')}`;
};

export default function CRMList() {
  const navigate = useNavigate();
  const { crmRecords, updateCrmRecord, deleteCrmRecord } = useIntranet();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    serviceType: '',
    clientStatus: statuses[0],
    monthlyAmount: '',
  });

  const monthlyTotal = useMemo(
    () => crmRecords.reduce((acc, item) => acc + (Number(item.monthlyAmount) || 0), 0),
    [crmRecords],
  );

  const onEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      firstName: item.firstName,
      lastName: item.lastName,
      companyName: item.companyName,
      serviceType: item.serviceType,
      clientStatus: item.clientStatus,
      monthlyAmount: item.monthlyAmount,
    });
  };

  const onDelete = (id) => {
    deleteCrmRecord(id);
    if (editingId === id) setEditingId(null);
  };

  const onSave = () => {
    if (!editingId) return;
    updateCrmRecord(editingId, editForm);
    setEditingId(null);
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.34)] md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="intranet-heading text-2xl font-black text-white">Lista completa CRM</h3>
          <p className="mt-1 text-sm text-white/65">Puedes editar, eliminar o registrar nuevos perfiles.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => navigate('/intranet/dashboard/crm/perfil')} className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-bold text-white">Agregar</button>
          <span className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white">Total mensual: {money(monthlyTotal)}</span>
        </div>
      </div>

      {crmRecords.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-white/20 bg-white/[0.02] p-4 text-sm text-white/65">Aun no hay registros CRM.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-white/60">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Servicio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Origen</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {crmRecords.map((item) => (
                <tr key={item.id} className="text-white/85">
                  <td className="px-4 py-3 font-semibold">{item.firstName} {item.lastName}</td>
                  <td className="px-4 py-3">{item.companyName}</td>
                  <td className="px-4 py-3">{item.serviceType}</td>
                  <td className="px-4 py-3">{item.clientStatus}</td>
                  <td className="px-4 py-3">{item.leadSource}</td>
                  <td className="px-4 py-3">{money(item.monthlyAmount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onEdit(item)} className="rounded-lg border border-white/20 px-2 py-1 text-xs font-bold text-white/85">Editar</button>
                      <button type="button" onClick={() => onDelete(item.id)} className="rounded-lg border border-[#e73c50]/40 px-2 py-1 text-xs font-bold text-[#ffb1bc]">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingId && (
        <div className="mt-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-3">
          <input value={editForm.firstName} onChange={(e) => setEditForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="Nombre" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={editForm.lastName} onChange={(e) => setEditForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="Apellidos" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={editForm.companyName} onChange={(e) => setEditForm((prev) => ({ ...prev, companyName: e.target.value }))} placeholder="Empresa" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={editForm.serviceType} onChange={(e) => setEditForm((prev) => ({ ...prev, serviceType: e.target.value }))} placeholder="Servicio" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <select value={editForm.clientStatus} onChange={(e) => setEditForm((prev) => ({ ...prev, clientStatus: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none">{statuses.map((status) => (<option key={status} value={status}>{status}</option>))}</select>
          <input type="number" min="0" value={editForm.monthlyAmount} onChange={(e) => setEditForm((prev) => ({ ...prev, monthlyAmount: e.target.value }))} placeholder="Monto" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <div className="md:col-span-3 flex gap-2">
            <button type="button" onClick={onSave} className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white">Guardar cambios</button>
            <button type="button" onClick={() => setEditingId(null)} className="rounded-xl border border-white/20 px-3 py-2 text-sm font-bold text-white/80">Cancelar</button>
          </div>
        </div>
      )}
    </section>
  );
}
