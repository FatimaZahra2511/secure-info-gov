'use client';
import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [docs, setDocs] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);
  const router = useRouter();

  const handlePieClick = ({ department }) => {
  router.push(`/processus?dept=${encodeURIComponent(department)}`);
};



  // useEffect in dashboard/page.js
useEffect(() => {
  fetch('/api/assets') // <-- no ?id= in the URL
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setDocs(data);
      } else {
        console.error('❌ Expected an array but got:', data);
        setDocs([]);
      }
    })
    .catch((err) => {
      console.error('❌ Failed to fetch assets:', err);
      setDocs([]);
    });
}, []);


  const total = docs.length;
  const byRisk = ['Élevé', 'Moyen', 'Faible'].map((level) => ({
    risk: level,
    count: docs.filter((d) => d.risk === level).length,
  }));
  const deptCounts = docs.reduce((acc, d) => {
    acc[d.department] = (acc[d.department] || 0) + 1;
    return acc;
  }, {});
  const byDept = Object.entries(deptCounts).map(([department, count]) => ({
    department, count,
  }));

 const COLORS = [
  '#e53e3e', // red
  '#dd6b20', // orange
  '#38a169', // green
  '#3182ce', // blue
  '#805ad5', // purple
  '#d69e2e', // gold
  '#319795', // teal
  '#f56565', // pink-red
  '#00B5D8', // cyan
  '#9F7AEA', // violet
  '#F6AD55', // apricot
  '#68D391', // light green
  '#63B3ED', // sky blue
  '#D53F8C', // pink
];

const ACCEPTANCE_COLORS = [
  '#006D77', // Accepté - deep teal
  '#FFB703', // Non Accepté - amber
  '#708090', // Non défini - light grey
];

const SENSIBILITE_COLORS = [
  '#FF6B6B', // Faible - soft coral red
  '#FFD166', // Moyenne - warm yellow
  '#118AB2', // Élevée - fresh blue
];



  const showToast = ({ department, count }) => {
    setToastMsg(`📊 ${department} – ${count} doc${count > 1 ? 's' : ''}`);
    setTimeout(() => setToastMsg(null), 3000);
  };

const avgAttenuation = (
  docs.reduce((sum, d) => sum + (parseInt(d.attenuation) || 0), 0) / docs.length || 0
).toFixed(1);

const avgResidualRisk = (
  docs.reduce((sum, d) => sum + (parseInt(d.risqueResiduel) || 0), 0) / docs.length || 0
).toFixed(1);

const byResidual = Array.from(new Set(docs.map(d => d.risqueResiduel)))
  .sort((a, b) => a - b)
  .map((res) => ({
    residuel: res,
    count: docs.filter(d => d.risqueResiduel === res).length,
  }));
const byClassification = Array.from(new Set(docs.map(d => d.classification)))
  .map((cls) => ({
    classification: cls || 'Non défini',
    count: docs.filter(d => d.classification === cls).length,
  }));
const bySensibilite = ['Faible', 'Moyenne', 'Élevée'].map((level) => ({
  level,
  count: docs.filter((d) => d.sensibilite === level).length,
}));

const byAcceptance = [
  { label: 'Accepté', match: ['Oui', 'Accepté', true] },
  { label: 'Non Accepté', match: ['Non', 'Non Accepté', false] },
  { label: 'Non défini', match: [null, '', undefined] },
].map(({ label, match }) => ({
  status: label,
  count: docs.filter(d => match.includes(d.risqueAccepte)).length,
}));
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

// Inverse map: department → processus
const departmentToProcessus = Object.fromEntries(
  Object.entries(processusToDepartment).map(([proc, dept]) => [dept, proc])
);


const residualByDept = docs.reduce((acc, doc) => {
  const dept = doc.department || 'Non défini';
  const val = parseFloat(doc.risqueResiduel);
  if (!isNaN(val)) {
    acc[dept] = acc[dept] || { sum: 0, count: 0 };
    acc[dept].sum += val;
    acc[dept].count += 1;
  }
  return acc;
}, {});

// Step 2: Map departments to processus and build full array
const residualByProcessus = Object.entries(
  docs.reduce((acc, doc) => {
    const dept = doc.department || 'Non défini';
    const processus = departmentToProcessus[dept] || 'Autre'; // fallback
    const val = parseFloat(doc.risqueResiduel);
    if (!isNaN(val)) {
      acc[processus] = acc[processus] || { sum: 0, count: 0 };
      acc[processus].sum += val;
      acc[processus].count += 1;
    }
    return acc;
  }, {})
).map(([processus, { sum, count }]) => ({
  processus,
  avgResidual: (sum / count).toFixed(1),
}));

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

    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
  <div className="flex items-center justify-between">
    <h1 className="text-3xl font-bold text-gray-800">Tableau de Bord</h1>
    <NavDropdown />
  </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">
          <p className="text-sm text-gray-600">Total Actifs</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
        {byRisk.map(({ risk, count }) => (
          <div key={risk} className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Risque – {risk}</p>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
          </div>
        ))}
        {byClassification.map(({ classification, count }) => (
  <div key={classification} className="p-4 bg-white rounded shadow">
    <p className="text-sm text-gray-600">{classification}</p>
    <p className="text-2xl font-bold text-gray-800">{count}</p>
  </div>
))}


<div className="p-4 bg-white rounded shadow">
  <p className="text-sm text-gray-600">Moy. Atténuation</p>
  <p className="text-2xl font-bold text-gray-800">{avgAttenuation}%</p>
</div>

<div className="p-4 bg-white rounded shadow">
  <p className="text-sm text-gray-600">Moy. Risque Résiduel</p>
  <p className="text-2xl font-bold text-gray-800">{avgResidualRisk}</p>
</div>

      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow h-80">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Actif par Risque</h2>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={byRisk} margin={{ top: 10, right: 20, bottom: 20 }}>
              <XAxis dataKey="risk" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2F855A" />
            </BarChart>
          </ResponsiveContainer>
        </div>
         
        <div className="bg-white p-4 rounded shadow h-80">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">Actifs par Département</h2>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={byDept}
                dataKey="count"
                nameKey="department"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                label
                onClick={handlePieClick}
              >
                {byDept.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow h-80">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Distribution Risque Résiduel</h2>
  <ResponsiveContainer width="100%" height="85%">
    <BarChart data={byResidual} margin={{ top: 10, right: 20, bottom: 20 }}>
      <XAxis dataKey="residuel" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="count" fill="#805ad5" />
    </BarChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-4 rounded shadow h-80">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Classification des Actifs</h2>
  <ResponsiveContainer width="100%" height="85%">
    <BarChart data={byClassification} margin={{ top: 10, right: 20, bottom: 20 }}>
      <XAxis dataKey="classification" />
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="count" fill="#C97C91" />
    </BarChart>
  </ResponsiveContainer>
</div>
<div className="bg-white p-4 rounded shadow h-80">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Sensibilité des Actifs</h2>
  <ResponsiveContainer width="100%" height="85%">
    <PieChart>
      <Pie
        data={bySensibilite}
        dataKey="count"
        nameKey="level"
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={60}
        label
      >
        {bySensibilite.map((_, i) => (
          <Cell key={i} fill={SENSIBILITE_COLORS[i % SENSIBILITE_COLORS.length]} />
))}
      </Pie>
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
</div>


<div className="bg-white p-4 rounded shadow h-80">
  <h2 className="text-lg font-semibold text-gray-800 mb-2" >Statut d’Acceptation du Risque</h2>
  <ResponsiveContainer width="100%" height="85%">
    <PieChart>
      <Pie
        data={byAcceptance}
        dataKey="count"
        nameKey="status"
        cx="50%"
        cy="50%"
        innerRadius={30}
        outerRadius={60}
        label
      >
        {byAcceptance.map((_, i) => (
          <Cell key={i} fill={ACCEPTANCE_COLORS[i % ACCEPTANCE_COLORS.length]} />
))}
      </Pie>
      <Legend verticalAlign="bottom" height={36} />
    </PieChart>
  </ResponsiveContainer>
</div>
 
 <div className="bg-white p-4 rounded shadow h-100">
  <h2 className="text-lg font-semibold text-gray-800 mb-2">Risque Résiduel Moyen par Processus</h2>
  <ResponsiveContainer width="100%" height="85%">
    <BarChart data={residualByProcessus} margin={{ top: 10, right: 20, bottom: 60 }}>
      <XAxis dataKey="processus" angle={-20} textAnchor="end" interval={0}/>
      <YAxis allowDecimals={false} />
      <Tooltip />
      <Bar dataKey="avgResidual" fill="#63B3ED" />
    </BarChart>
  </ResponsiveContainer>
</div>


      </div>

      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 bg-gray-800 text-white px-4 py-2 rounded shadow-lg">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
