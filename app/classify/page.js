'use client';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

export default function PageDeClassification() {
  const [nomDocument, setNomDocument] = useState('');
  const [departement, setDepartement] = useState('');
  const [donneesPersonnelles, setDonneesPersonnelles] = useState(false);
  const [owner, setOwner] = useState('');

  const [description, setDescription] = useState('');
  const [origine, setOrigine] = useState('');
  const [destination, setDestination] = useState('');
  const [formatPapier, setFormatPapier] = useState(false);
  const [formatElectronique, setFormatElectronique] = useState(false);


  const [cScore, setCScore] = useState('');
  const [iScore, setIScore] = useState('');
  const [aScore, setAScore] = useState('');
  const [tScore, setTScore] = useState('');

  const [impactOp, setImpactOp] = useState('');
  const [impactConf, setImpactConf] = useState('');
  const [impactRep, setImpactRep] = useState('');
  const [impactFin, setImpactFin] = useState('');
  const [probabilite, setProbabilite] = useState('');

  const [classification, setClassification] = useState('');
  const [niveauRisque, setNiveauRisque] = useState('');
  const [sensibilite, setSensibilite] = useState('');
  const [fileInfo, setFileInfo] = useState({ fileName: '', fileUrl: '' });

  const [exposition, setExposition] = useState('');
  const [risqueBrut, setRisqueBrut] = useState('');
  const [analyseRisque, setAnalyseRisque] = useState('');
  const [highlightMesures, setHighlightMesures] = useState(false);

  const [risqueResiduel, setRisqueResiduel] = useState('');

  const getSuggestedScoresFromClassification = (classification) => {
  switch (classification) {
    case 'Très Confidentiel':
      return { a: 4, i: 5, c: 5, t: 5 };
    case 'Confidentiel':
      return { a: 3, i: 4, c: 4, t: 4 };
    case 'Interne':
      return { a: 2, i: 3, c: 2, t: 2 };
    case 'Non classifié':
      return { a: 1, i: 1, c: 1, t: 1 };
    default:
      return null;
  }
};

  const [mesuresExistantes, setMesuresExistantes] = useState('');
  const [attenuation, setAttenuation] = useState('');
  const [risqueAccepte, setRisqueAccepte] = useState('');

  const fileInputRef = useRef(null);

  const clampScore = (val) => {
    let num = parseInt(val, 10);
    if (isNaN(num)) return 1;
    return Math.min(5, Math.max(1, num));
  };

  const getRiskAnalysis = (value) => {
    if (value <= 10) return 'Acceptable';
    if (value <= 30) return 'À revoir';
    if (value <= 50) return 'Critique';
    return 'Très Élevé';
  };

  const calculateSensibilite = (c, i, a, t) => {
    const total = clampScore(c) + clampScore(i) + clampScore(a) + clampScore(t);
    if (total <= 9) return 'Faible';
    if (total <= 15) return 'Moyenne';
    return 'Élevée';
  };

  const calculateRisque = (dp, classification) => {
  if (dp && (classification === 'Très Confidentiel' || classification === 'Confidentiel')) return 'Élevé';
  if (dp && classification === 'Interne') return 'Moyen';
  if (!dp && classification === 'Très Confidentiel') return 'Moyen';
  if (!dp && classification === 'Confidentiel') return 'Moyen';
  return 'Faible';
};


  const calculateAdvancedRisk = () => {
    const impacts = [impactOp, impactConf, impactRep, impactFin].map(clampScore);
    const prob = parseInt(probabilite);
    const totalImpact = impacts.reduce((acc, val) => acc + val, 0);
    const score = totalImpact * prob;
    if (!prob || !totalImpact) return calculateRisque(donneesPersonnelles, classification);
    if (score <= 33) return 'Faible';
    if (score <= 66) return 'Moyen';
    return 'Élevé';
  };

  useEffect(() => {
    setSensibilite(calculateSensibilite(cScore, iScore, aScore, tScore));
    setNiveauRisque(calculateAdvancedRisk());

    const cid = clampScore(cScore) + clampScore(iScore) + clampScore(aScore) + clampScore(tScore);
    const exp = parseInt(exposition || '1');
    const brut = cid * exp;
    setRisqueBrut(brut);
    setAnalyseRisque(getRiskAnalysis(brut));
    setRisqueResiduel(Math.max(0, brut - 10));
  }, [cScore, iScore, aScore, tScore, impactOp, impactConf, impactRep, impactFin, probabilite, exposition]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInfo({
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
      });
    }
  };

  const resetForm = () => {
    setNomDocument('');
    setOwner('');
    setDepartement('');
    setDonneesPersonnelles(false);
    setDescription('');
    setOrigine('');
    setDestination('');
    setFormatPapier(false);
    setFormatElectronique(false);
    setCScore('');
    setIScore('');
    setAScore('');
    setTScore('');
    setImpactOp('');
    setImpactConf('');
    setImpactRep('');
    setImpactFin('');
    setProbabilite('');
    setClassification('');
    setNiveauRisque('');
    setSensibilite('');
    setExposition('');
    setRisqueBrut('');
    setAnalyseRisque('');
    setMesuresExistantes('');
    setAttenuation('');
    setRisqueAccepte('');
    setFileInfo({ fileName: '', fileUrl: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: nomDocument,
      department: departement,
      owner: owner,
      description,
      origine,
      destination,
      formatPapier,
      formatElectronique,
      dp: donneesPersonnelles,
      cScore: clampScore(cScore),
      iScore: clampScore(iScore),
      aScore: clampScore(aScore),
      tScore: clampScore(tScore),
      impactOp: clampScore(impactOp),
      impactConf: clampScore(impactConf),
      impactRep: clampScore(impactRep),
      impactFin: clampScore(impactFin),
      probabilite: parseInt(probabilite),
      exposition: parseInt(exposition),
      risqueBrut,
      analyseRisque,
      classification,
      sensibilite,
      risk: calculateRisque(donneesPersonnelles, classification),
      attenuation: parseInt(attenuation),
      risqueAccepte,
      mesuresExistantes,
      risqueResiduel,
      fileName: fileInfo.fileName,
      fileUrl: fileInfo.fileUrl,
    };
    console.log('DP value being submitted:', donneesPersonnelles);
    console.log('Payload DP field:', payload.dp);

    toast(
      ({ closeToast }) => (
        <div className="p-4 space-y-1 text-sm">
          <p className="font-semibold">{payload.name}</p>
          <p><strong>Département:</strong> {payload.department}</p>
          <p><strong>Données personnelles :</strong> {payload.dp ? 'Oui' : 'Non'}</p>
          <p><strong>Scores D/I/C/T:</strong> {payload.aScore} / {payload.iScore} / {payload.cScore} / {payload.tScore}</p>
          <p><strong>Impacts:</strong> {payload.impactOp} / {payload.impactConf} / {payload.impactRep} / {payload.impactFin}</p>
          <p><strong>Probabilité:</strong> {payload.probabilite}</p>
          <p><strong>Exposition:</strong> {payload.exposition}</p>
          <p><strong>Risque Brut:</strong> {payload.risqueBrut} — {payload.analyseRisque}</p>
          <p><strong>Atténuation:</strong> {payload.attenuation}%</p>
          <p><strong>Risque Résiduel:</strong> {payload.risqueResiduel}</p>
          <p><strong>Risque Accepté:</strong> {payload.risqueAccepte}</p>
          <p><strong>Risque:</strong> {payload.risk}</p>
          <p><strong>Sensibilité:</strong> {payload.sensibilite}</p>
          <p><strong>Classification:</strong> {payload.classification}</p>
          {payload.fileName && <p><strong>Fichier:</strong> {payload.fileName}</p>}
          <div className="mt-3 flex justify-end space-x-2">
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/assets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                  });
                  if (!res.ok) throw new Error(`HTTP ${res.status}`);
                  const created = await res.json();
                  new BroadcastChannel('classification').postMessage('new-document');
                  closeToast();
                  toast.success(`✅ "${created.name}" créé (ID: ${created.id})`);
                  resetForm();
                } catch (err) {
                  closeToast();
                  toast.error(`Erreur API: ${err.message}`);
                }
              }}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Confirmer
            </button>
            <button
              onClick={() => closeToast()}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
            >
              Modifier
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false, hideProgressBar: true }
    );
  };

 const scoreField = (label, value, setter) => {
  let tooltipText = `Score de ${label.toLowerCase()}`;

  if (label === 'Disponibilité') {
    tooltipText = "Capacité à accéder à l'information en temps voulu (ex : disponibilité des systèmes, accès aux fichiers).";
  } else if (label === 'Intégrité') {
    tooltipText = "Exactitude et complétude de l'information (ex : absence de modification non autorisée, cohérence des données).";
  } else if (label === 'Confidentialité') {
    tooltipText = "Protection contre l'accès non autorisé à l'information (ex : données personnelles, secrets professionnels).";
  } else if (label === 'Traçabilité') {
    tooltipText = "Capacité à retracer les actions sur l'information (ex : journalisation, audit, historique des modifications).";
  } else if (label === 'Impact Opérationnel') {
    tooltipText = "Conséquences sur l'activité, la continuité de service ou la productivité de l'organisation.";
  } else if (label === 'Impact Conformité') {
    tooltipText = "Conséquences juridiques ou réglementaires (ex : amendes, violations de la loi).";
  } else if (label === 'Impact Réputationnel') {
    tooltipText = "Atteinte à l'image, à la crédibilité ou à la confiance des partenaires/clients.";
  } else if (label === 'Impact Financier') {
    tooltipText = "Pertes économiques, coûts additionnels ou manque à gagner liés à l'incident.";
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} (1–5)
        <span
          className="ml-1 text-xs text-gray-500 cursor-pointer"
          title={tooltipText}
        >
          ℹ️
        </span>
      </label>
      <input
        type="number"
        min={1}
        max={5}
        placeholder="1–5"
        value={value || ''}
        onChange={(e) => setter(e.target.value)}
        onBlur={() => setter(clampScore(value).toString())}
        className="mt-1 block w-full p-2 border border-gray-400 rounded-md text-gray-900"
      />
    </div>
  );
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
        <option value="/documents">Liste des Actifs</option>
        <option value="/audit">Historique des Actions</option>
        <option value="/dashboard">Tableau de Bord</option>
      </select>
    </div>
  );
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-2xl w-full bg-white border border-gray-200 p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
  <img src="/it6.png" alt="IT6 Logo" className="h-25" />
  <NavDropdown />
</div>


        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Classification Des Actifs</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700"><label className="block text-sm font-medium text-gray-900">Nom de l'actif informationnel</label>
</label>
            <input type="text" required value={nomDocument} onChange={(e) => setNomDocument(e.target.value)} className="mt-1 block w-full p-2 border rounded-md text-gray-900" />
            {/* Propriétaire de l’actif */}
<div>
  <label className="block text-sm font-medium text-gray-900">Propriétaire de l’actif</label>
  <input
    type="text"
    value={owner}
    onChange={(e) => setOwner(e.target.value)}
    className="mt-1 block w-full p-2 border rounded-md text-gray-900"
    placeholder="Ex : Responsable IT, Chef RH..."
  />
</div>

            {/* Description de l’actif */}
<div>
  <label className="block text-sm font-medium text-gray-900">Description de l’actif</label>
  <textarea
    rows={2}
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="mt-1 block w-full p-2 border rounded-md text-gray-900"
    placeholder="Description"
  />
</div>

{/* Origine de l’actif */}
<div>
  <label className="block text-sm font-medium text-gray-900">Origine de l’actif</label>
  <input
    type="text"
    value={origine}
    onChange={(e) => setOrigine(e.target.value)}
    className="mt-1 block w-full p-2 border rounded-md text-gray-900"
    placeholder="Ex : Généré par le service IT, reçu par email, etc."
  />
</div>

{/* Destination de l’actif */}
<div>
  <label className="block text-sm font-medium text-gray-900">Destination de l’actif</label>
  <input
    type="text"
    value={destination}
    onChange={(e) => setDestination(e.target.value)}
    className="mt-1 block w-full p-2 border rounded-md text-gray-900"
    placeholder="Ex : Archivage interne, transmission au partenaire, etc."
  />
</div>

{/* Format (checkboxes) */}
<div>
  <label className="block text-sm font-medium text-gray-900 mb-1">Format</label>
  <div className="flex gap-4">
    <label className="flex items-center gap-2 text-gray-800 font-medium">
      <input
        type="checkbox"
        checked={formatPapier}
        onChange={() => setFormatPapier(!formatPapier)}
        className="text-blue-600"
      />
      Papier
    </label>
    <label className="flex items-center gap-2 text-gray-800 font-medium">
      <input
        type="checkbox"
        checked={formatElectronique}
        onChange={() => setFormatElectronique(!formatElectronique)}
        className="text-blue-600"
      />
      Électronique
    </label>
  </div>
</div>

          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <select required value={departement} onChange={(e) => setDepartement(e.target.value)} className="mt-1 block w-full p-2 border rounded-md text-gray-900">
              <option value="">-- Sélectionner --</option>
              <option>Direction Générale</option>
<option>Ressources Humaines</option>
<option>Finances</option>
<option>Informatique</option>
<option>Conformité & Sécurité</option>
<option>Juridique</option>
<option>Opérations</option>
<option>Marketing</option>
            </select>
          </div>
        
          {/* Checkbox */}
          <div className="flex items-center">
            <input id="donneesPersonnelles" type="checkbox" checked={donneesPersonnelles} onChange={() => setDonneesPersonnelles(!donneesPersonnelles)} className="h-4 w-4 text-blue-600 rounded" />
            <label htmlFor="donneesPersonnelles" className="ml-2 text-sm text-gray-700">Contient des données personnelles ?</label>
          </div>

          <fieldset className="mt-6 border border-gray-300 rounded-md p-4">
  <legend className="text-sm font-semibold text-gray-700 px-2">Évaluation de l’actif</legend>

  {/* Classification */}
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">Niveau de classification (DNSSI)</label>
    <select
      required
      value={classification}
      onChange={(e) => {
        const selected = e.target.value;
        setClassification(selected);

        const suggested = getSuggestedScoresFromClassification(selected);
        if (suggested) {
          setAScore(suggested.a.toString());
          setIScore(suggested.i.toString());
          setCScore(suggested.c.toString());
          setTScore(suggested.t.toString());
        }
      }}
      className="mt-1 block w-full p-2 border rounded-md text-gray-900"
    >
      <option value="">-- Sélectionner --</option>
      <option>Non classifié</option>
      <option>Interne</option>
      <option>Confidentiel</option>
      <option>Très Confidentiel</option>
    </select>
  </div>

  {/* DICT */}
  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {scoreField('Disponibilité', aScore, setAScore)}
    {scoreField('Intégrité', iScore, setIScore)}
    {scoreField('Confidentialité', cScore, setCScore)}
    {scoreField('Traçabilité', tScore, setTScore)}
  </div>

  {/* Impacts */}
  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
    {scoreField('Impact Opérationnel', impactOp, setImpactOp)}
    {scoreField('Impact Conformité', impactConf, setImpactConf)}
    {scoreField('Impact Réputationnel', impactRep, setImpactRep)}
    {scoreField('Impact Financier', impactFin, setImpactFin)}
  </div>
</fieldset>

<fieldset className="mt-6 border border-gray-300 rounded-md p-4">
  <legend className="text-sm font-semibold text-gray-700 px-2">Évaluation du risque</legend>

          {/* Probabilité */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Probabilité d’occurrence</label>
            <select required value={probabilite} onChange={(e) => setProbabilite(e.target.value)} className="mt-1 block w-full p-2 border rounded-md text-gray-900">
              <option value="">-- Sélectionner --</option>
              <option value="1">1 — Très Rare</option>
              <option value="2">2 — Rare</option>
              <option value="3">3 — Possible</option>
              <option value="4">4 — Probable</option>
              <option value="5">5 — Très Probable</option>
            </select>
          </div>

          {/* Exposition */}
<div>
  <label className="block text-sm font-medium text-gray-700">
    Exposition (1–9)
    <span
      title="Exposition à la menace : degré d'exposition de l'actif à un événement non souhaité."
      className="ml-1 text-xs text-gray-500 cursor-pointer"
    >
      ℹ️
    </span>
  </label>
  <input
    type="number"
    min={1}
    max={9}
    placeholder="1–9"
    value={exposition || ''}
    onChange={(e) => setExposition(e.target.value)}
    className="mt-1 block w-full p-2 border border-gray-400 rounded-md text-gray-900"
  />
</div>

{/* Risque Brut + Analyse */}
{risqueBrut && (
  <div className="mt-2 p-3 bg-gray-100 border border-gray-300 text-gray-800 rounded text-center">
    <strong>Risque Brut :</strong> {risqueBrut} — {analyseRisque}
  </div>
)}

          <fieldset className="mt-6 border border-gray-300 rounded-md p-4">
  <legend className="text-sm font-semibold text-gray-700 px-2">Traitement du risque</legend>

  {/* Mesures existantes */}
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">
      Mesures existantes
      <span
        title="Décrivez les dispositifs de sécurité déjà mis en place (ex : chiffrement, contrôle d’accès, sauvegarde…)."
        className="ml-1 text-xs text-gray-500 cursor-pointer"
      >
        ℹ️
      </span>
    </label>
    <textarea
  value={mesuresExistantes}
  onChange={(e) => {
    setMesuresExistantes(e.target.value);
    if (e.target.value.trim()) setHighlightMesures(false); // remove highlight
  }}
  rows={3}
  placeholder="Ex : Données chiffrées, accès restreint aux administrateurs..."
  className={`mt-1 block w-full p-2 border rounded-md text-gray-900 ${
    highlightMesures ? 'border-red-500' : 'border-gray-300'
  }`}
/>

  </div>
</fieldset>
  {/* % Atténuation */}
  <div className="mt-4">
    <label className="block text-sm font-medium text-gray-700">
      % Atténuation du risque
      <span
        title="Estimation du pourcentage de réduction du risque grâce aux mesures existantes."
        className="ml-1 text-xs text-gray-500 cursor-pointer"
      >
        ℹ️
      </span>
    </label>
    <input
  type="number"
  min={0}
  max={100}
  value={attenuation}
  onChange={(e) => setAttenuation(e.target.value)}
  placeholder="0-100"
  onFocus={() => {
    if (!mesuresExistantes.trim()) {
      setHighlightMesures(true);
    }
  }}
  className={`mt-1 block w-full p-2 rounded-md text-gray-900 border ${
    !mesuresExistantes.trim()
      ? 'border-gray-300'
      : 'border-gray-400'
  } ${highlightMesures ? 'ring-2 ring-red-400' : ''}`}
  disabled={!mesuresExistantes.trim()}
/>


  </div>

  {/* Risque Résiduel */}
  {risqueResiduel !== '' && (
    <div className="mt-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded text-center">
      <strong>Risque Résiduel :</strong> {risqueResiduel}
    </div>
  )}

  {/* Risque Accepté */}
<div className="mt-4">
  <label className="block text-sm font-medium text-gray-700">Risque accepté ?</label>
  <select
    required
    value={risqueAccepte}
    onChange={(e) => setRisqueAccepte(e.target.value)}
    className="mt-1 block w-full p-2 border rounded-md text-gray-900"
  >
    <option value="">-- Sélectionner --</option>
    <option value="Oui">Oui</option>
    <option value="Non">Non</option>
  </select>
</div>

{/* ⚠️ Alert if accepted but risk is high */}
  {risqueAccepte === 'Oui' && risqueResiduel > 30 && (
    <div className="mt-3 p-3 bg-orange-100 border border-orange-300 text-orange-800 rounded text-sm">
      ⚠️ <strong>Attention :</strong> Le risque résiduel est <strong>élevé</strong> mais a été marqué comme <strong>"Accepté"</strong>. Veuillez vérifier la décision.
    </div>
  )}

</fieldset>




          {/* Results */}
          {niveauRisque && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-300 text-blue-800 rounded text-center">
              <strong>Niveau de risque :</strong> {niveauRisque}
            </div>
          )}
          {sensibilite && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded text-center">
              <strong>Sensibilité :</strong> {sensibilite}
            </div>
          )}


          {/* File */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Pièce jointe (facultatif)</label>
            <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} ref={fileInputRef} className="mt-1 block w-full text-gray-900" />
          </div>

          {/* Submit */}
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition">
            Sauvegarder
          </button>
        </form>
      </div>
    </div>
  );
}