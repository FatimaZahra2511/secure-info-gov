'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';


export default function AuditPage() {
  const [auditTrail, setAuditTrail] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');


  // Fetch audit entries from API
  const loadAuditTrail = () => {
  try {
    const data = JSON.parse(localStorage.getItem('auditTrail') || '[]');
    setAuditTrail(data);
  } catch (err) {
    console.error(err);
    toast.error('Erreur lors de la lecture des audits');
  }
};

  useEffect(() => {
  // initial load
  loadAuditTrail();

  // live update from /documents via BroadcastChannel
  const bc = new BroadcastChannel('audit');
  bc.onmessage = (ev) => {
    if (ev.data === 'new-audit') {
      loadAuditTrail();
    }
  };

  // live update when the tab becomes visible
  const handleVisibility = () => {
    if (document.visibilityState === 'visible') {
      loadAuditTrail();
    }
  };
  document.addEventListener('visibilitychange', handleVisibility);

  return () => {
    bc.close();
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}, []);

  const exportCSV = () => {
    if (auditTrail.length === 0) return;
    const headers = ['Horodatage', 'Action', 'ID Document', 'Nom Document'];
    const rows = auditTrail.map((e) => [
      e.timestamp,
      e.action,
      e.docId,
      e.nom,
    ]);
    const csvContent = [headers, ...rows]
      .map((r) => r.map((v) => `"${v}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_trail.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeleteAudit = (id) => {
  const confirmed = confirm('Confirmer la suppression de cet historique ?');
  if (!confirmed) return;

  const updated = auditTrail.filter((a) => a.id !== id);
  setAuditTrail(updated);
  localStorage.setItem('auditTrail', JSON.stringify(updated));
  toast.success('Entrée supprimée.');
};

// Inline navigation dropdown
const NavDropdown = () => {
  const handleNavigate = (e) => {
    const page = e.target.value;
    if (page) window.open(page, '_blank');
  };

  return (
    <div className="flex justify-end mb-6">
      <select
        onChange={handleNavigate}
        className="border border-gray-300 rounded px-4 py-2 text-gray-700 shadow-sm focus:ring focus:outline-none"
      >
        <option value="">Naviguer vers...</option>
        <option value="/processus">Portail des Processus</option>
        <option value="/classify">Classifier un Actif</option>
        <option value="/documents">Liste des Actif</option>
        <option value="/audit">Historique des Actions</option>
        <option value="/dashboard">Tableau de Bord</option>
      </select>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
  <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
     <div className="flex justify-center mb-6">
  <img src="/it6.png" alt="Logo IT6" className="h-25" />
</div>
<NavDropdown />
<h1 className="text-4xl font-bold text-gray-800 text-center mb-2">Historique des Modifications</h1>
<p className="text-sm text-gray-500 text-center mt-2">
  Suivi des modifications et suppressions des actifs classifiés
</p>

      {auditTrail.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">Aucune activité enregistrée.</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={exportCSV}
              className="px-4 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
            >
              Exporter l’historique
            </button>
          </div>

          {/* ✅ Place filters here */}
<div className="flex flex-wrap gap-4 justify-between items-center mb-6">
  <input
    type="text"
    placeholder="Rechercher par ID ou Nom"
    className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-800 placeholder-gray-600 shadow-sm focus:ring focus:outline-none"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <select
    className="border border-gray-300 rounded px-4 py-2 text-sm text-gray-800 shadow-sm focus:ring focus:outline-none"
    value={actionFilter}
    onChange={(e) => setActionFilter(e.target.value)}
  >
    <option value="">Toutes les actions</option>
    <option value="Modification">Modification</option>
    <option value="Suppression">Suppression</option>
  </select>
</div>
          <div className="overflow-x-auto rounded-lg shadow">
  <table className="w-full text-sm bg-white border border-gray-400 rounded-lg">
              <caption className="sr-only">
                Tableau de l’historique des modifications de documents
              </caption>
              <thead className="sticky top-0 bg-white z-10 shadow-sm text-gray-800 font-semibold border-b">
                <tr>
                  <th className="border p-3 text-center">Horodatage</th>
                  <th className="border p-3 text-center">Action</th>
                  <th className="border p-3 text-center">ID</th>
                  <th className="border p-3 text-center">Nom</th>
                </tr>
              </thead>
              <tbody className="text-gray-900">
                {auditTrail.map((entry, idx) => (
                  <tr
  key={entry.id}
  className={`${
    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
  } hover:bg-gray-100 transition-colors`}
>

                    <td className="border p-2">{entry.timestamp}</td>
                    <td className="border p-2 text-center">
  <span
    className={`inline-block px-2 py-1 rounded text-xs font-semibold w-auto ${
      entry.action === 'Suppression'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}
  >
    {entry.action}
  </span>
</td>

                    <td
  className="border p-2 font-mono text-xs max-w-[120px] truncate"
  title={entry.docId}
>
  {entry.docId.slice(0, 8)}…
</td>

                    <td className="border p-2 max-w-xs break-words flex justify-between items-center">
  {entry.nom}
  <button
    onClick={() => handleDeleteAudit(entry.id)}
    className="text-red-600 hover:text-red-800 text-sm ml-2"
    title="Supprimer"
  >
    🗑️
  </button>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div> {/* Close inner white box */}
</div>
  );
}
