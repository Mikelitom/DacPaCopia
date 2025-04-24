'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConveniosPage() {
  const [tab, setTab] = useState('crear');

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estado de Cuenta</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded border ${tab === 'crear' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setTab('crear')}
        >
          ➕ Crear Convenio
        </button>
        <button
          className={`px-4 py-2 rounded border ${tab === 'activos' ? 'bg-black text-white' : 'bg-white text-black'}`}
          onClick={() => setTab('activos')}
        >
          📑 Convenios Activos
        </button>
      </div>

      {/* Contenido de cada tab */}
      <div className="bg-white border rounded p-4 shadow-sm">
        {tab === 'crear' && <CrearConvenio />}
        {tab === 'activos' && <TablaConveniosActivos />}
      </div>
    </div>
  );
}

function TablaConveniosActivos() {
  return (
    <table className="min-w-full border border-gray-300 rounded-lg">
      <thead className="bg-pink-200">
        <tr>
          <th className="px-4 py-2 border">Folio del Convenio</th>
          <th className="px-4 py-2 border">Nombre</th>
          <th className="px-4 py-2 border">Inicio del Convenio</th>
          <th className="px-4 py-2 border">Fin del Convenio</th>
          <th className="px-4 py-2 border">Cantidad</th>
          <th className="px-4 py-2 border">Comprobante</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td className="px-4 py-2 border">CONV-00123</td>
          <td className="px-4 py-2 border">María López</td>
          <td className="px-4 py-2 border">2025-03-01</td>
          <td className="px-4 py-2 border">2025-08-01</td>
          <td className="px-4 py-2 border">$6,000</td>
          <td className="px-4 py-2 border">
            <button className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 rounded">
              Descargar PDF
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// --- Componente de Crear Convenio Integrado ---
function CrearConvenio() {
  const router = useRouter();
  const [form, setForm] = useState({
    padre: '',
    alumno: '',
    salon: '',
    correo: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.padre || !form.alumno || !form.salon || !form.correo || !form.telefono) {
      setError('Por favor llena todos los campos.');
      return;
    }

    await fetch('/api/convenios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setSuccess('¡Convenio creado con éxito!');
    setForm({
      padre: '',
      alumno: '',
      salon: '',
      correo: '',
      telefono: '',
    });

    setTimeout(() => {
      router.push('/colegiatura/convenios');
    }, 1500);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Crear Convenio</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded mb-4 border border-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-2 rounded mb-4 border border-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="padre"
          placeholder="Nombre del padre de familia"
          onChange={handleChange}
          value={form.padre}
          className="border p-2 w-full rounded"
        />
        <input
          name="alumno"
          placeholder="Nombre del alumno"
          onChange={handleChange}
          value={form.alumno}
          className="border p-2 w-full rounded"
        />
        <input
          name="salon"
          placeholder="Salón del alumno"
          onChange={handleChange}
          value={form.salon}
          className="border p-2 w-full rounded"
        />
        <input
          name="correo"
          placeholder="Correo electrónico"
          type="email"
          onChange={handleChange}
          value={form.correo}
          className="border p-2 w-full rounded"
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          type="tel"
          onChange={handleChange}
          value={form.telefono}
          className="border p-2 w-full rounded"
        />
        <button type="submit" className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Crear Convenio
        </button>
      </form>

      <div className="mt-6">
        <button className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400">
          Descargar Formato de Convenio
        </button>
      </div>
    </div>
  );
}
