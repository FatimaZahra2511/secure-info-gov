'use client';

import { useRouter } from 'next/navigation';

export default function NavDropdown() {
  const router = useRouter();

  const handleNavigate = (e) => {
    const page = e.target.value;
    if (page) router.push(page);
  };

  return (
    <div className="flex justify-end mb-6">
      <select
        onChange={handleNavigate}
        className="border border-gray-300 rounded px-4 py-2 text-gray-700 shadow-sm focus:ring focus:outline-none"
      >
        <option value="">Naviguer vers...</option>
        <option value="/processus">Portail des Processus</option>
        <option value="/classify">Classifier un actif</option>
        <option value="/documents">Liste des documents</option>
        <option value="/audit">Historique des actions</option>
        <option value="/dashboard">Tableau de bord</option>
      </select>
    </div>
  );
}
