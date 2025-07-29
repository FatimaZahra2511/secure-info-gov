'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function FicheTechnique() {
  const { id } = useParams();
  const [asset, setAsset] = useState(null);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const res = await fetch(`/api/assets?id=${id}`);
        const data = await res.json();
        setAsset(data);
      } catch (err) {
        console.error('Erreur chargement fiche technique:', err);
      }
    };
    if (id) fetchAsset();
  }, [id]);

  if (!asset) {
    return <div className="p-6 text-center text-gray-500">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6">
          <img src="/it6.png" alt="Logo" className="h-16" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Fiche Technique de l’Actif
        </h1>
    

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Info label="Nom de l’actif" value={asset.name} />
  <Info label="Propriétaire" value={asset.owner} />
  <Info label="Département" value={asset.department} />
  <Info label="Description" value={asset.description} />
  <Info label="Origine" value={asset.origine} />
  <Info label="Destination" value={asset.destination} />
  <Info label="Format Papier" value={asset.formatPapier ? 'Oui' : 'Non'} />
  <Info label="Format Électronique" value={asset.formatElectronique ? 'Oui' : 'Non'} />
  <Info label="Données personnelles" value={asset.dp ? 'Oui' : 'Non'} />
  <Info label="Classification" value={asset.classification} />
  <Info label="Sensibilité" value={asset.sensibilite} />
  <Info label="Risque" value={asset.risk} />
  <Info label="Risque accepté" value={asset.risqueAccepte} />
</div>


        <hr className="my-6" />

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Scores DICT</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Info label="Disponibilité" value={asset.aScore} />
          <Info label="Intégrité" value={asset.iScore} />
          <Info label="Confidentialité" value={asset.cScore} />
          <Info label="Traçabilité" value={asset.tScore} />
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Évaluation des Impacts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Info label="Impact Opérationnel" value={asset.impactOp} />
          <Info label="Impact Conformité" value={asset.impactConf} />
          <Info label="Impact Réputationnel" value={asset.impactRep} />
          <Info label="Impact Financier" value={asset.impactFin} />
        </div>

        <hr className="my-6" />

        <h2 className="text-lg font-semibold text-gray-700 mb-2">Analyse de Risque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Info label="Probabilité" value={asset.probabilite} />
          <Info label="Exposition" value={asset.exposition} />
          <Info label="Risque Brut" value={asset.risqueBrut} />
          <Info label="Analyse du risque" value={asset.analyseRisque} />
          <Info label="Atténuation (%)" value={asset.attenuation + '%'} />
          <Info label="Risque Résiduel" value={asset.risqueResiduel} />
        </div>

        {asset.mesuresExistantes && (
          <>
            <hr className="my-6" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Mesures existantes</h2>
            <p className="bg-gray-50 border p-4 rounded text-gray-800">{asset.mesuresExistantes}</p>
          </>
        )}

        {asset.fileUrl && (
          <>
            <hr className="my-6" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Pièce jointe</h2>
            <a
              href={asset.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Télécharger {asset.fileName}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-medium text-gray-800">{value || '—'}</div>
    </div>
  );
}
