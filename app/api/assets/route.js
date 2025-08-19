
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request) {
try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      const asset = await prisma.asset.findUnique({ where: { id } });
      return new Response(JSON.stringify(asset), { status: 200 });
    }
  const assets = await prisma.asset.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      department: true,
      owner: true,
      description: true,
      origine: true,
      destination: true,
      formatPapier: true,
      formatElectronique: true,
      dp: true,
      cScore: true,
      iScore: true,
      aScore: true,
      tScore: true,
      sensibilite: true,
      impactOp: true,
      impactConf: true,
      impactRep: true,
      impactFin: true,
      probabilite: true,
      exposition: true,
      attenuation: true,
      risqueBrut: true,
      risqueResiduel: true,
      risqueAccepte: true,
      analyseRisque: true,
      mesuresExistantes: true,
      risk: true,
      classification: true,
      fileName: true,
      fileUrl: true,
      conformite: true,
      createdAt: true,
      processus: true,
      description: true,
      origine: true,
      destination: true,
      formatPapier: true,
      formatElectronique: true,
    },
  });

  return new Response(JSON.stringify(assets), { status: 200 });
} catch (error) {
    console.error('❌ ERROR in /api/assets:', error); // <--- ADD THIS LINE
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(request) {
  const {
    name,
    department,
    owner,
    description,
    origine,
    destination,
    formatPapier,
    formatElectronique,
    dp,
    cScore,
    iScore,
    aScore,
    tScore,
    sensibilite,
    impactOp,
    impactConf,
    impactRep,
    impactFin,
    probabilite,
    exposition,
    attenuation,
    risqueBrut,
    risqueResiduel,
    risqueAccepte,
    analyseRisque,
    mesuresExistantes,
    risk,
    classification,
    fileName,
    fileUrl,
  
  } = await request.json();


  const departmentToProcessus = {
  'Ressources Humaines': 'Paie',
  'Finances': 'Budgétisation',
  'Informatique': 'Support IT',
  'Juridique': 'Conformité Légale',
  'Direction Générale': 'Stratégie',
  'Marketing': 'Communication',
  'Conformité & Sécurité': 'Audit Sécurité',
  'Opérations': 'Gestion Courante',
};

const processus = departmentToProcessus[department] || 'Autre';
// Auto-calculate conformité
let conformite = 'Non Conforme';
const risqueResiduelInt = parseInt(risqueResiduel);
const risqueBrutInt = parseInt(risqueBrut);

if (!isNaN(risqueResiduelInt) && !isNaN(risqueBrutInt)) {
  conformite = risqueResiduelInt <= (risqueBrutInt / 2) ? 'Conforme' : 'Non Conforme';
}

  const asset = await prisma.asset.create({
    data: {
      name,
      department,
      owner,
      description,
      origine,
      destination,
      formatPapier,
      formatElectronique,
      dp,
      cScore,
      iScore,
      aScore,
      tScore,         
      sensibilite,
      impactOp,
      impactConf,
      impactRep,
      impactFin,
      probabilite,
      exposition,
      attenuation,
      risqueBrut,
      risqueResiduel,
      risqueAccepte,
      analyseRisque,
      mesuresExistantes,
      risk,
      classification,
      fileName,
      fileUrl,
      processus,
      description,
      conformite,
    },
  });

  return new Response(JSON.stringify(asset), { status: 201 });
}
