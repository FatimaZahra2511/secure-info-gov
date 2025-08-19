'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import NavDropdown from '../components/NavDropdown';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedDoc, setEditedDoc] = useState({});
  const [passwordValidated, setPasswordValidated] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const PASSWORD = '1234';

  function calculateRisqueBrut(probabilite, exposition) {
  const p = parseInt(probabilite);
  const e = parseInt(exposition);
  return isNaN(p) || isNaN(e) ? null : p * e;
}

function calculateRisqueResiduel(risqueBrut, attenuation) {
  const r = parseFloat(risqueBrut);
  const a = parseFloat(attenuation);
  if (isNaN(r) || isNaN(a)) return null;
  return Math.round(r * (1 - a / 100));
}


  // Fetch all assets
  const loadDocuments = async () => {
  try {
    const res = await fetch('/api/assets');
    const data = await res.json(); // this line is failing
    console.log('DATA LOADED:', data);
    setDocuments(data);
  } catch (err) {
    console.error('Error loading documents:', err);
    toast.error('Erreur lors du chargement');
  }
};


  // Audit logging + broadcast
  const logAudit = (action, doc) => {
  const audit = {
    id: crypto.randomUUID(),
    action,
    timestamp: new Date().toLocaleString('fr-FR'),
    docId: doc.id || doc.docId || '—',
    nom: doc.name || doc.nom || '—',
  };
  const existing = JSON.parse(localStorage.getItem('auditTrail') || '[]');
  localStorage.setItem('auditTrail', JSON.stringify([...existing, audit]));

  // Notify AuditPage
  const bc = new BroadcastChannel('audit');
  bc.postMessage('new-audit');
  bc.close();
};

  const checkCompliance = (doc) =>
    doc.owner && ['Confidentiel', 'Très Confidentiel'].includes(doc.classification)
      ? 'Conforme'
      : 'Non Conforme';

  const calculateRisque = (dp, classification) => {
  if (!classification) return 'Faible';
  if (dp && ['Très Confidentiel', 'Confidentiel'].includes(classification)) return 'Élevé';
  if (dp && classification === 'Interne') return 'Moyen';
  if (!dp && classification === 'Très Confidentiel') return 'Moyen';
  if (!dp && classification === 'Confidentiel') return 'Moyen';
  return 'Faible';
};


  // initial load
  useEffect(() => {
    loadDocuments();
  }, []);

  // live-refresh on new documents
  useEffect(() => {
    const bc = new BroadcastChannel('classification');
    bc.onmessage = (ev) => {
      if (ev.data === 'new-document') loadDocuments();
    };
    return () => bc.close();
  }, []);

  const handleDelete = async (id, name) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;
    try {
      await fetch(`/api/assets/${id}`, { method: 'DELETE' });
      toast.success('Document supprimé');
      logAudit('Suppression', { id, name });
      loadDocuments();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const handleEdit = (doc, idx) => {
    setEditingIndex(idx);
    setEditedDoc({ ...doc });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        name: editedDoc.name,
        department: editedDoc.department,
        owner: editedDoc.owner,
        description: editedDoc.description,
        origine: editedDoc.origine,
        destination: editedDoc.destination,
        formatPapier: editedDoc.formatPapier,
        formatElectronique: editedDoc.formatElectronique,
        dp: editedDoc.dp,
        cScore: editedDoc.cScore,
        iScore: editedDoc.iScore,
        aScore: editedDoc.aScore,
        classification: editedDoc.classification,
        risk: calculateRisque(editedDoc.dp, editedDoc.classification),
        fileName: editedDoc.fileName,
        fileUrl: editedDoc.fileUrl,
        impactOp: editedDoc.impactOp,
impactConf: editedDoc.impactConf,
impactRep: editedDoc.impactRep,
impactFin: editedDoc.impactFin,
probabilite: editedDoc.probabilite,
exposition: editedDoc.exposition,
risqueBrut: editedDoc.risqueBrut,
analyseRisque: editedDoc.analyseRisque,
mesuresExistantes: editedDoc.mesuresExistantes,
attenuation: editedDoc.attenuation,
risqueResiduel: editedDoc.risqueResiduel,
risqueAccepte: editedDoc.risqueAccepte,

      };
      await fetch(`/api/assets/${editedDoc.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      toast.success('Document mis à jour');
      logAudit('Modification', editedDoc);
      setEditingIndex(null);
      loadDocuments();
    } catch {
      toast.error('Erreur de mise à jour');
    }
  };

  const handlePassword = () => {
    const input = prompt('Entrez le mot de passe :');
    if (input === PASSWORD) setPasswordValidated(true);
    else toast.error('Mot de passe incorrect');
  };

  // filters + search
  const filteredDocs = documents.filter((doc) => {
    const comp = checkCompliance(doc);
    const mSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.department.toLowerCase().includes(search.toLowerCase()) ||
      doc.id.includes(search);
    const mRisk = filterRisk ? doc.risk === filterRisk : true;
    const mComp = filterCompliance ? comp === filterCompliance : true;
    const createdISO = doc.createdAt.slice(0, 10);
    const mDate = filterDate ? createdISO === filterDate : true;
    return mSearch && mRisk && mComp && mDate;
  });
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
        <option value="/documents">Liste des Actifs</option>
        <option value="/audit">Historique des Actions</option>
        <option value="/dashboard">Tableau de Bord</option>
      </select>
    </div>
  );
};
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-[95%] mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
  <img src="/it6.png" alt="Logo IT6" className="h-16" />
  <NavDropdown />
</div>

        <h1 className="text-xl font-bold text-gray-800">Actifs Classifiés</h1>

        {!passwordValidated && (
          <button
            onClick={handlePassword}
            className="mb-6 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded shadow transition"

          >
            Déverrouiller pour modifier
          </button>
        )}

        {/* Filters toolbar */}
        <div className="mb-6 bg-white p-4 rounded shadow flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[150px] p-2 border rounded bg-white opacity-100 text-gray-900"
          />
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="p-2 border rounded bg-white opacity-100 text-gray-900"
          >
            <option value="">Risque</option>
            <option>Élevé</option>
            <option>Moyen</option>
            <option>Faible</option>
          </select>
          <select
            value={filterCompliance}
            onChange={(e) => setFilterCompliance(e.target.value)}
            className="p-2 border rounded bg-white opacity-100 text-gray-900"
          >
            <option value="">Conformité</option>
            <option>Conforme</option>
            <option>Non Conforme</option>
          </select>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border rounded bg-white opacity-100 text-gray-900"
          />
          <Link
            href="/audit"
            target="_blank"
            rel="noopener"
            className="bg-gray-600 text-white px-4 py-2 rounded"
          >
            Voir l’historique
          </Link>
        </div>

        {/* Data table */}
        <div className="overflow-x-auto w-full bg-white rounded shadow">
  <table className="min-w-[1400px] w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  'ID',
                  'Nom',
                  'Propriétaire',
                  'Description',
                  'Origine',
                  'Destination',
                  'Format Papier',
                  'Format Électronique',
                  'Dept',
                  'D.P',
                  'D/I/C/T',
                  'Sensibilité',
                  'Impacts',
                  'Probabilité',
                  'Exposition',
                  'Risque Brut',
                  'Mesures',
                  'Atténuation',
                  'Résiduel',
                  'Accepté',
                  'Class.',
                  'Risque',
                  'Conformité',
                   'Date',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2 text-left text-sm font-medium text-gray-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocs.map((doc, idx) => {
                const comp = checkCompliance(doc);
                const isEditing = idx === editingIndex;
                return (
                  <tr key={doc.id}>
                    {/* ID (truncated for layout) */}
<td className="px-4 py-2 text-sm text-gray-900 font-mono max-w-[120px] truncate hover:overflow-visible relative">
  <span title={doc.id}>{doc.id.slice(0, 8)}…</span>
</td>


                    {/* Name */}
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {isEditing ? (
                        <input
                          value={editedDoc.name}
                          onChange={(e) =>
                            setEditedDoc({ ...editedDoc, name: e.target.value })
                          }
                          className="w-full p-1 border rounded"
                        />
                      ) : (
                        doc.name
                      )}
                    </td>
                    {/* Owner */}
<td className="px-4 py-2 text-sm text-gray-900">
  {isEditing ? (
    <input
      value={editedDoc.owner || ''}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, owner: e.target.value })
      }
      className="w-full p-1 border rounded"
    />
  ) : (
    doc.owner || '—'
  )}
</td>
                    {/* Description */}
<td className="px-4 py-2 text-sm text-gray-900">
  {isEditing ? (
    <input
      value={editedDoc.description || ''}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, description: e.target.value })
      }
      className="w-full p-1 border rounded"
      placeholder="Description"
    />
  ) : (
    doc.description || '—'
  )}
</td>
                    {/* Origine */}
<td className="px-4 py-2 text-sm text-gray-900">
  {isEditing ? (
    <input
      value={editedDoc.origine || ''}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, origine: e.target.value })
      }
      className="w-full p-1 border rounded"
      placeholder="Origine"
    />
  ) : (
    doc.origine || '—'
  )}
</td>
                    {/* Destination */}
<td className="px-4 py-2 text-sm text-gray-900">
  {isEditing ? (
    <input
      value={editedDoc.destination || ''}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, destination: e.target.value })
      }
      className="w-full p-1 border rounded"
      placeholder="Destination"
    />
  ) : (
    doc.destination || '—'
  )}
</td>
                    {/* Format Papier */}
<td className="px-4 py-2 text-sm text-gray-900 text-center">
  {isEditing ? (
    <input
      type="checkbox"
      checked={editedDoc.formatPapier || false}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, formatPapier: e.target.checked })
      }
    />
  ) : (
    doc.formatPapier ? '✔️' : '—'
  )}
</td>
                    {/* Format Electronique */}
<td className="px-4 py-2 text-sm text-gray-900 text-center">
  {isEditing ? (
    <input
      type="checkbox"
      checked={editedDoc.formatElectronique || false}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, formatElectronique: e.target.checked })
      }
    />
  ) : (
    doc.formatElectronique ? '✔️' : '—'
  )}
</td>

                    {/* Department */}
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {isEditing ? (
                        <select
                          value={editedDoc.department}
                          onChange={(e) =>
                            setEditedDoc({ ...editedDoc, department: e.target.value })
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option>Direction Générale</option>
                          <option>Ressources Humaines</option>
                          <option>Finances</option>
                          <option>Informatique</option>
                          <option>Conformité & Sécurité</option>
                          <option>Juridique</option>
                          <option>Opérations</option>
                          <option>Marketing</option>
                        </select>
                      ) : (
                        doc.department
                      )}
                    </td>
                     {/* D.P */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <input
      type="checkbox"
      checked={editedDoc.dp || false}
      onChange={(e) => setEditedDoc({ ...editedDoc, dp: e.target.checked })}
    />
  ) : (
    doc.dp ? 'Oui' : 'Non'
  )}
</td>



                    {/* D/I/C/T */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <div className="grid grid-cols-2 gap-1">
      {['aScore', 'iScore', 'cScore', 'tScore'].map((field, i) => (
        <input
          key={field}
          type="number"
          min={1}
          max={5}
          value={editedDoc[field] ?? ''}
          onChange={(e) => setEditedDoc({ ...editedDoc, [field]: e.target.value })}
          className="w-full p-1 border rounded text-center"
          placeholder={['D', 'I', 'C', 'T'][i]}
        />
      ))}
    </div>
  ) : (
    <span>{`${doc.aScore}/${doc.iScore}/${doc.cScore}/${doc.tScore}`}</span>
  )}
</td>


{/* Sensibilité */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {doc.sensibilite || '—'}
</td>


{/* Impacts */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <div className="grid grid-cols-2 gap-1">
      {['impactOp', 'impactConf', 'impactRep', 'impactFin'].map((field, i) => (
        <input
          key={field}
          type="number"
          min={1}
          max={5}
          value={editedDoc[field] ?? ''}
          onChange={(e) => setEditedDoc({ ...editedDoc, [field]: e.target.value })}
          className="w-full p-1 border rounded text-center"
          placeholder={['Op', 'Conf', 'Rep', 'Fin'][i]}
        />
      ))}
    </div>
  ) : (
    <span>{`${doc.impactOp}/${doc.impactConf}/${doc.impactRep}/${doc.impactFin}`}</span>
  )}
</td>

{/* Probabilité */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <input
      type="number"
      min={1}
      max={5}
      value={editedDoc.probabilite ?? ''}
      onChange={(e) => {
        const probabilite = e.target.value;
        const exposition = editedDoc.exposition;
        const risqueBrut = calculateRisqueBrut(probabilite, exposition);
        const risqueResiduel = calculateRisqueResiduel(risqueBrut, editedDoc.attenuation);
        setEditedDoc({
          ...editedDoc,
          probabilite,
          risqueBrut,
          risqueResiduel,
        });
      }}
      className="w-16 p-1 border rounded text-center"
    />
  ) : (
    doc.probabilite ?? '—'
  )}
</td>



{/* Exposition */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <input
      type="number"
      min={1}
      max={9}
      value={editedDoc.exposition ?? ''}
      onChange={(e) => {
        const exposition = e.target.value;
        const probabilite = editedDoc.probabilite;
        const risqueBrut = calculateRisqueBrut(probabilite, exposition);
        const risqueResiduel = calculateRisqueResiduel(risqueBrut, editedDoc.attenuation);
        setEditedDoc({
          ...editedDoc,
          exposition,
          risqueBrut,
          risqueResiduel,
        });
      }}
      className="w-16 p-1 border rounded text-center"
    />
  ) : (
    doc.exposition ?? '—'
  )}
</td>

{/* Risque Brut */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {doc.risqueBrut !== null && doc.risqueBrut !== undefined ? doc.risqueBrut : '—'}
</td>


                   {/* Mesures Existantes */}
<td className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap max-w-[300px]">
  {isEditing ? (
    <textarea
      rows={3}
      value={editedDoc.mesuresExistantes || ''}
      onChange={(e) =>
        setEditedDoc({ ...editedDoc, mesuresExistantes: e.target.value })
      }
      className="w-full p-1 border rounded text-sm"
      placeholder="Ex: VPN, MFA, chiffrement, accès restreint..."
    />
  ) : (
    <span className="block max-w-[300px] truncate" title={doc.mesuresExistantes}>
      {doc.mesuresExistantes || '—'}
    </span>
  )}
</td>



                   {/* % Atténuation */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <input
      type="number"
      min={0}
      max={100}
      value={editedDoc.attenuation ?? ''}
      onChange={(e) => {
        const attenuation = e.target.value;
        const risqueBrut = editedDoc.risqueBrut ?? 0;
        const risqueResiduel = calculateRisqueResiduel(risqueBrut, attenuation);
        setEditedDoc({
          ...editedDoc,
          attenuation,
          risqueResiduel,
        });
      }}
      className="w-16 p-1 border rounded text-center"
      placeholder="%"
    />
  ) : (
    doc.attenuation !== undefined ? `${doc.attenuation}%` : '—'
  )}
</td>

                    {/* Résiduel */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {doc.risqueResiduel !== null && doc.risqueResiduel !== undefined ? doc.risqueResiduel : '—'}

</td>
  

{/* Accepté */}
<td className="px-4 py-2 text-sm text-gray-900 text-center whitespace-nowrap">
  {isEditing ? (
    <select
      value={editedDoc.risqueAccepte ?? ''}
      onChange={(e) => setEditedDoc({ ...editedDoc, risqueAccepte: e.target.value })}
      className="p-1 border rounded w-full"
    >
      <option value="">--</option>
      <option value="Oui">Oui</option>
      <option value="Non">Non</option>
    </select>
  ) : (
    doc.risqueAccepte || '—'
  )}
</td>


                    {/* Classification */}
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {isEditing ? (
                        <select
                          value={editedDoc.classification}
                          onChange={(e) =>
                            setEditedDoc({
                              ...editedDoc,
                              classification: e.target.value,
                            })
                          }
                          className="w-full p-1 border rounded"
                        >
                          <option>Non classifié</option>
                          <option>Interne</option>
                          <option>Confidentiel</option>
                          <option>Très Confidentiel</option>
                        </select>
                      ) : (
                        doc.classification
                      )}
                    </td>

                    {/* Risk */}
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {isEditing
                        ? calculateRisque(editedDoc.owner, editedDoc.classification)
                        : doc.risk}
                    </td>


                    {/* Compliance */}
                    <td className="px-4 py-2 text-sm text-gray-900">{comp}</td>
                    

                    {/* Date */}
                    <td className="px-4 py-2 text-sm text-gray-900">
                      {new Date(doc.createdAt).toLocaleDateString('fr-FR')}
                    </td>


                    {/* Actions */}
                    <td className="px-4 py-2 text-sm">
  {isEditing ? (
    <div className="flex gap-2">
      <button
        onClick={saveEdit}
        className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
      >
        Enregistrer
      </button>
      <button
        onClick={() => setEditingIndex(null)}
        className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
      >
        Annuler
      </button>
    </div>
  ) : (
    passwordValidated && (
      <div className="flex gap-2">
        <button
          onClick={() => handleEdit(doc, idx)}
          className="bg-gray-500 text-white px-3 py-1 rounded text-sm"
        >
          Modifier
        </button>
        <button
          onClick={() => handleDelete(doc.id, doc.name)}
          className="bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Supprimer
        </button>
      </div>
    )
  )}
</td>

                         
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
{/* ✅ Add this style block right here — inside return, before closing ) */}
    <style jsx global>{`
      input[type='number']::-webkit-outer-spin-button,
      input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type='number'] {
        -moz-appearance: textfield;
      }
    `}</style>
    </div>

  );
}