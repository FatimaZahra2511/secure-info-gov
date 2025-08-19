'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';


export default function ProcessusPage() {

  const processusToDepartment = {
  'Paie': 'Ressources Humaines',
  'Budgétisation': 'Finances',
  'Support IT': 'Informatique',
  'Conformité Légale': 'Juridique',
  'Stratégie': 'Direction Générale',
  'Communication': 'Marketing',
  'Audit Sécurité': 'Conformité & Sécurité',
  'Gestion Courante': 'Opérations',
};

  const searchParams = useSearchParams();
const initialDept = searchParams.get('dept');

const inverseMap = Object.entries(processusToDepartment).find(
  ([, dept]) => dept === initialDept
);
const [selectedProcessus, setSelectedProcessus] = useState(
  inverseMap?.[0] || 'Paie'
);

  const [documents, setDocuments] = useState([]);

  const processusList = [
  '--Sélectionner un processus--',
  'Paie',
  'Budgétisation',
  'Support IT',
  'Conformité Légale',
  'Stratégie',
  'Communication',
  'Audit Sécurité',
  'Gestion Courante',
];

const fichesData = {
  'Paie': {
    description: 'Gestion des salaires, primes, bulletins, et déclarations.',
    responsable: 'Service RH',
    objectif: 'Garantir le paiement régulier et conforme des employés.',
    formatPapier: true,
    formatElectronique: true,
  },
  'Budgétisation': {
    description: 'Élaboration et suivi des budgets annuels.',
    responsable: 'Service Financier',
    objectif: 'Optimiser l’utilisation des ressources financières.',
    formatPapier: false,
    formatElectronique: true,
  },
  'Support IT': {
    description: 'Support technique, infrastructure réseau, helpdesk.',
    responsable: 'Équipe IT',
    objectif: 'Assurer la disponibilité des systèmes informatiques.',
    formatPapier: false,
    formatElectronique: true,
  },
  'Conformité Légale': {
    description: 'Gestion des risques juridiques et veille réglementaire.',
    responsable: 'Département Juridique',
    objectif: 'Assurer la conformité de l’organisation.',
    formatPapier: true,
    formatElectronique: true,
  },
  'Stratégie': {
    description: 'Définition de la vision et des objectifs à long terme.',
    responsable: 'Direction Générale',
    objectif: 'Orienter le développement de l’organisation.',
    formatPapier: false,
    formatElectronique: true,
  },
  'Communication': {
    description: 'Communication interne et externe de l’organisation.',
    responsable: 'Service Communication',
    objectif: 'Promouvoir l’image et les actions de l’organisation.',
    formatPapier: true,
    formatElectronique: true,
  },
  'Audit Sécurité': {
    description: 'Évaluation de la sécurité des systèmes et données.',
    responsable: 'Cellule Conformité & Sécurité',
    objectif: 'Identifier et corriger les vulnérabilités.',
    formatPapier: false,
    formatElectronique: true,
  },
  'Gestion Courante': {
    description: 'Gestion quotidienne des opérations et de la logistique.',
    responsable: 'Département Opérations',
    objectif: 'Assurer le bon déroulement des activités.',
    formatPapier: true,
    formatElectronique: true,
  },
};



  const loadDocuments = async () => {
  try {
    const res = await fetch('/api/assets');

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    setDocuments(data);
  } catch (err) {
    console.error('Erreur lors du chargement des actifs :', err);
  }
};


  useEffect(() => {
  // 👇 Load on first render
  loadDocuments();

  const bc = new BroadcastChannel('classification');
  bc.onmessage = (ev) => {
    if (ev.data === 'new-document') {
      loadDocuments();
    }
  };
  return () => bc.close();
}, []);


const filteredAssets = documents.filter(
  (doc) => doc.department === processusToDepartment[selectedProcessus]
);


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <div className="flex justify-center mb-6">
          <img src="/it6.png" alt="Logo IT6" className="h-30" />
        </div>


        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Portail de Gestion des Processus
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Accédez aux fiches techniques, ajoutez de nouveaux actifs et consultez les éléments classifiés par processus.
        </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 text-center">
  <a
    href="/documents"
    target="_blank"
    rel="noopener noreferrer"
    className="p-4 bg-gray-800 text-white rounded shadow hover:bg-gray-900 transition"
  >
    Liste des Actifs
  </a>

  <a
    href="/audit"
    target="_blank"
    rel="noopener noreferrer"
    className="p-4 bg-gray-800 text-white rounded shadow hover:bg-gray-900 transition"
  >
    Historique des actions
  </a>

  <a
    href="/dashboard"
    target="_blank"
    rel="noopener noreferrer"
    className="p-4 bg-gray-800 text-white rounded shadow hover:bg-gray-900 transition"
  >
    Tableau de Bord Global
  </a>
</div>


        <div className="flex justify-center mb-8">
          <label className="text-sm font-semibold mr-2 self-center text-gray-800">
            Consulter un processus :
          </label>
          <select
            className="w-72 px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedProcessus}
            onChange={(e) => setSelectedProcessus(e.target.value)}
          >
            {processusList.map((proc) => (
              <option key={proc} value={proc}>
                {proc}
              </option>
            ))}
          </select>
        </div>
          {/* 📄 Fiche technique du processus */}
{selectedProcessus && fichesData[selectedProcessus] && (
  <div className="mb-8 px-6 py-4 bg-gradient-to-br from-purple-50 to-white border border-purple-300 rounded-xl shadow">
  <h3 className="text-2xl font-semibold text-purple-900 mb-4">
     Fiche Technique – {selectedProcessus}
  </h3>
  <ul className="space-y-2 text-sm text-gray-800">
    <li><strong>Description :</strong> {fichesData[selectedProcessus].description}</li>
    <li><strong>Responsable :</strong> {fichesData[selectedProcessus].responsable}</li>
    <li><strong>Objectif :</strong> {fichesData[selectedProcessus].objectif}</li>
    <li>
      <strong>Formats :</strong>{' '}
      {fichesData[selectedProcessus].formatPapier && <span className="inline-block mr-2">Papier ✔️</span>}
      {fichesData[selectedProcessus].formatElectronique && <span>Électronique ✔️</span>}
    </li>
  </ul>
</div>

)}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Actifs du processus
          </h2>
          <a
  href="/classify"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gray-800 text-white text-sm px-4 py-2 rounded hover:bg-gray-900 transition"
>
  + Ajouter un actif
</a>

        </div>

        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full table-auto text-sm bg-white border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
  <tr>
    <th className="border p-3 text-center">Nom</th>
    <th className="border p-3 text-center">Département</th>
    <th className="border p-3 text-center">Propriétaire</th>
    <th className="border p-3 text-center">D.P</th>
    <th className="border p-3 text-center">Classification</th>
    <th className="border p-3 text-center">Risque</th>
    <th className="border p-3 text-center">Date</th>
        <th className="border p-3 text-center">Fiche</th>

  </tr>
</thead>

            <tbody>
  {filteredAssets.map((doc, idx) => (
    <tr
      key={doc.id}
      className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition`}
    >
      <td className="border p-3 text-gray-900">{doc.name}</td>
      <td className="border p-3 text-gray-900">{doc.department}</td>
      <td className="border p-3 text-gray-900">{doc.owner || '—'}</td>
      <td className="border p-3 text-gray-900">{doc.dp ? 'Oui' : 'Non'}</td>
      <td className="border p-3 text-gray-900">{doc.classification || '—'}</td>
      <td className="border p-3 text-gray-900">{doc.risk || '—'}</td>
      <td className="border p-3 text-gray-900">
        {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('fr-FR') : '—'}
      </td>
            <td className="border border-gray-800 p-3 text-left">
  <a
    href={`/fiche/${doc.id}`}
    className="block w-full text-blue-600 underline hover:text-blue-800 text-sm"
  >
    Voir Fiche
  </a>
</td>




    </tr>
  ))}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
