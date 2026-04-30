import { useState } from 'react';
import { useIntranet } from '../context/IntranetContext';

const states = ['Pendiente', 'En proceso', 'Entregado'];

export default function Requests() {
  const { requests, addRequest, updateRequestStatus } = useIntranet();
  const [form, setForm] = useState({
    project: '',
    client: '',
    requestType: '',
    description: '',
    deadline: '',
    responsible: '',
    status: 'Pendiente',
  });

  const submit = (event) => {
    event.preventDefault();
    if (!form.project.trim() || !form.client.trim()) return;
    addRequest(form);
    setForm({
      project: '',
      client: '',
      requestType: '',
      description: '',
      deadline: '',
      responsible: '',
      status: 'Pendiente',
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <h2 className="intranet-heading text-3xl font-black text-white">Requerimientos / Solicitudes</h2>
      </section>

      <section className="rounded-3xl border border-white/10 bg-[#0d1029]/75 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-3">
          <input value={form.project} onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))} placeholder="Proyecto" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: e.target.value }))} placeholder="Cliente" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.requestType} onChange={(e) => setForm((p) => ({ ...p, requestType: e.target.value }))} placeholder="Tipo de requerimiento" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Descripcion" rows={2} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none md:col-span-2" />
          <input type="date" value={form.deadline} onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))} className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <input value={form.responsible} onChange={(e) => setForm((p) => ({ ...p, responsible: e.target.value }))} placeholder="Responsable" className="rounded-xl border border-white/15 bg-[#090c22] px-3 py-2 text-sm text-white outline-none" />
          <button type="submit" className="rounded-xl bg-gradient-to-r from-[#c42b3c] to-[#e73c50] px-4 py-2 text-sm font-black text-white">Registrar solicitud</button>
        </form>
      </section>

      <section className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d1029]/75 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.16em] text-white/60">
              <tr>
                <th className="px-4 py-3">Proyecto</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fecha limite</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {requests.map((request) => (
                <tr key={request.id} className="text-white/85">
                  <td className="px-4 py-3 font-semibold">{request.project}</td>
                  <td className="px-4 py-3">{request.client}</td>
                  <td className="px-4 py-3">{request.requestType}</td>
                  <td className="px-4 py-3">{request.deadline}</td>
                  <td className="px-4 py-3">{request.responsible}</td>
                  <td className="px-4 py-3">
                    <select value={request.status} onChange={(e) => updateRequestStatus(request.id, e.target.value)} className="rounded-lg border border-white/15 bg-[#090c22] px-2 py-1 text-xs text-white outline-none">
                      {states.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
