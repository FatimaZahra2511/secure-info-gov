import { NextResponse } from "next/server";

// Toggle demo mode via env var (Vercel: set DEMO=1)
const IS_DEMO = process.env.DEMO === "1";

// --- Demo dataset (shown when DEMO=1) ---
const demoAssets = [
  {
    id: "demo-1",
      name: "Registre Paie 2024",
      department: "Ressources Humaines",
      owner: "Service RH",
      description: "Registre mensuel de paie",
      origine: "Interne",
      destination: "Direction & RH",
      formatPapier: true,
      formatElectronique: true,
      dp: true,
      cScore: 4, iScore: 5, aScore: 3, tScore: 4,
      sensibilite: 4,
      impactOp: 3, impactConf: 4, impactRep: 3, impactFin: 4,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 16, risqueResiduel: 7, risqueAccepte: false,
      analyseRisque: "Contrôles d’accès et chiffrement",
      mesuresExistantes: "MFA, sauvegardes",
      risk: "Élevé",
      classification: "Secret",
      fileName: null,
      fileUrl: null,
      conformite: "Conforme",
      createdAt: days(0),
      processus: "Paie",
    },
    {
      id: "demo-2",
      name: "Budget Prévisionnel 2025 (V1)",
      department: "Finances",
      owner: "Service Financier",
      description: "Projection annuelle initiale",
      origine: "Interne",
      destination: "Direction Générale",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 3, iScore: 4, aScore: 3, tScore: 3,
      sensibilite: 3,
      impactOp: 2, impactConf: 3, impactRep: 2, impactFin: 4,
      probabilite: 2, exposition: 2, attenuation: 1,
      risqueBrut: 12, risqueResiduel: 5, risqueAccepte: true,
      analyseRisque: "Accès restreint, journalisation",
      mesuresExistantes: "RBAC, VPN",
      risk: "Moyen",
      classification: "Interne",
      fileName: null,
      fileUrl: null,
      conformite: "Conforme",
      createdAt: days(2),
      processus: "Budgétisation",
    },

    // 👇 Add many more (examples):
    {
      id: "demo-3",
      name: "Contrats Fournisseurs 2024",
      department: "Juridique",
      owner: "Dépt. Juridique",
      description: "Contrats et avenants signés",
      origine: "Externe",
      destination: "Direction & Juridique",
      formatPapier: true,
      formatElectronique: true,
      dp: true,
      cScore: 4, iScore: 4, aScore: 2, tScore: 3,
      sensibilite: 4,
      impactOp: 2, impactConf: 4, impactRep: 4, impactFin: 3,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 16, risqueResiduel: 8, risqueAccepte: false,
      analyseRisque: "Archivage sécurisé, signature électronique",
      mesuresExistantes: "Coffre-fort numérique",
      risk: "Élevé",
      classification: "Confidentiel",
      conformite: "Non Conforme",
      createdAt: days(5),
      processus: "Conformité Légale",
    },
    {
      id: "demo-4",
      name: "Plan de Communication Q3",
      department: "Marketing",
      owner: "Service Communication",
      description: "Campagnes et messages clé",
      origine: "Interne",
      destination: "Marketing",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 2, iScore: 3, aScore: 3, tScore: 2,
      sensibilite: 2,
      impactOp: 2, impactConf: 2, impactRep: 2, impactFin: 2,
      probabilite: 2, exposition: 1, attenuation: 2,
      risqueBrut: 8, risqueResiduel: 3, risqueAccepte: true,
      analyseRisque: "Validation avant diffusion",
      mesuresExistantes: "Workflow d’approbation",
      risk: "Faible",
      classification: "Public",
      conformite: "Conforme",
      createdAt: days(8),
      processus: "Communication",
    },
    {
      id: "demo-5",
      name: "Rapport Audit Sécu - Juin",
      department: "Conformité & Sécurité",
      owner: "Cellule Conformité",
      description: "Résultats tests d’intrusion",
      origine: "Interne",
      destination: "Direction & IT",
      formatPapier: false,
      formatElectronique: true,
      dp: true,
      cScore: 5, iScore: 4, aScore: 3, tScore: 4,
      sensibilite: 5,
      impactOp: 3, impactConf: 5, impactRep: 4, impactFin: 4,
      probabilite: 3, exposition: 3, attenuation: 2,
      risqueBrut: 25, risqueResiduel: 10, risqueAccepte: false,
      analyseRisque: "Correctifs prioritaires",
      mesuresExistantes: "SIEM, EDR",
      risk: "Élevé",
      classification: "Très Secret",
      conformite: "Non Conforme",
      createdAt: days(11),
      processus: "Audit Sécurité",
    },
    {
      id: "demo-6",
      name: "Procédures Helpdesk",
      department: "Informatique",
      owner: "Équipe IT",
      description: "Connaissances et SOP",
      origine: "Interne",
      destination: "IT",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 2, iScore: 3, aScore: 4, tScore: 2,
      sensibilite: 2,
      impactOp: 3, impactConf: 2, impactRep: 2, impactFin: 1,
      probabilite: 2, exposition: 2, attenuation: 3,
      risqueBrut: 8, risqueResiduel: 4, risqueAccepte: true,
      analyseRisque: "Sauvegardes régulières",
      mesuresExistantes: "Wiki interne",
      risk: "Faible",
      classification: "Interne",
      conformite: "Conforme",
      createdAt: days(14),
      processus: "Support IT",
    },
    {
      id: "demo-7",
      name: "Feuille de Route 2025",
      department: "Direction Générale",
      owner: "DG",
      description: "Vision stratégique et KPIs",
      origine: "Interne",
      destination: "Direction",
      formatPapier: false,
      formatElectronique: true,
      dp: true,
      cScore: 4, iScore: 3, aScore: 2, tScore: 3,
      sensibilite: 4,
      impactOp: 3, impactConf: 4, impactRep: 4, impactFin: 3,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 16, risqueResiduel: 6, risqueAccepte: false,
      analyseRisque: "Diffusion restreinte",
      mesuresExistantes: "DLP",
      risk: "Moyen",
      classification: "Confidentiel",
      conformite: "Conforme",
      createdAt: days(18),
      processus: "Stratégie",
    },
    {
      id: "demo-8",
      name: "Planning Logistique Été",
      department: "Opérations",
      owner: "Dépt. Opérations",
      description: "Ressources & horaires",
      origine: "Interne",
      destination: "Opérations",
      formatPapier: true,
      formatElectronique: true,
      dp: false,
      cScore: 2, iScore: 2, aScore: 3, tScore: 2,
      sensibilite: 2,
      impactOp: 3, impactConf: 1, impactRep: 2, impactFin: 2,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 8, risqueResiduel: 4, risqueAccepte: true,
      analyseRisque: "Contrôles d’accès locaux",
      mesuresExistantes: "Badges",
      risk: "Faible",
      classification: "Interne",
      conformite: "Conforme",
      createdAt: days(21),
      processus: "Gestion Courante",
    },
    {
      id: "demo-9",
      name: "Dossiers Employés",
      department: "Ressources Humaines",
      owner: "Service RH",
      description: "Données personnelles",
      origine: "Interne",
      destination: "RH",
      formatPapier: true,
      formatElectronique: true,
      dp: true,
      cScore: 5, iScore: 4, aScore: 3, tScore: 4,
      sensibilite: 5,
      impactOp: 3, impactConf: 5, impactRep: 4, impactFin: 3,
      probabilite: 3, exposition: 3, attenuation: 2,
      risqueBrut: 25, risqueResiduel: 12, risqueAccepte: false,
      analyseRisque: "Chiffrement au repos",
      mesuresExistantes: "Cloisonnement réseaux",
      risk: "Élevé",
      classification: "Secret",
      conformite: "Non Conforme",
      createdAt: days(25),
      processus: "Paie",
    },
    {
      id: "demo-10",
      name: "Politique Sécurité v3",
      department: "Conformité & Sécurité",
      owner: "RSSI",
      description: "Normes & exigences internes",
      origine: "Interne",
      destination: "Tous",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 3, iScore: 3, aScore: 3, tScore: 3,
      sensibilite: 3,
      impactOp: 2, impactConf: 3, impactRep: 3, impactFin: 2,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 12, risqueResiduel: 6, risqueAccepte: true,
      analyseRisque: "Revue annuelle",
      mesuresExistantes: "Formation sécurité",
      risk: "Moyen",
      classification: "Interne",
      conformite: "Conforme",
      createdAt: days(28),
      processus: "Audit Sécurité",
    },
    {
      id: "demo-11",
      name: "Rapport KPI Marketing",
      department: "Marketing",
      owner: "Service Communication",
      description: "Performances trimestrielles",
      origine: "Interne",
      destination: "Direction",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 2, iScore: 2, aScore: 2, tScore: 2,
      sensibilite: 2,
      impactOp: 1, impactConf: 2, impactRep: 2, impactFin: 2,
      probabilite: 2, exposition: 1, attenuation: 2,
      risqueBrut: 6, risqueResiduel: 3, risqueAccepte: true,
      analyseRisque: "Revue avant diffusion",
      mesuresExistantes: "Contrôle qualité",
      risk: "Faible",
      classification: "Public",
      conformite: "Conforme",
      createdAt: days(30),
      processus: "Communication",
    },
    {
      id: "demo-12",
      name: "Inventaire Matériel IT",
      department: "Informatique",
      owner: "Équipe IT",
      description: "Parc machines & licences",
      origine: "Interne",
      destination: "IT & Achat",
      formatPapier: false,
      formatElectronique: true,
      dp: false,
      cScore: 3, iScore: 3, aScore: 4, tScore: 3,
      sensibilite: 3,
      impactOp: 4, impactConf: 2, impactRep: 2, impactFin: 2,
      probabilite: 2, exposition: 2, attenuation: 2,
      risqueBrut: 12, risqueResiduel: 5, risqueAccepte: true,
      analyseRisque: "Sauvegardes & audits",
      mesuresExistantes: "MDM",
      risk: "Moyen",
      classification: "Interne",
      conformite: "Conforme",
      createdAt: days(33),
      processus: "Support IT",
    },
    {
  id: "demo-13",
  name: "Factures Clients T2",
  department: "Finances",
  owner: "Service Comptabilité",
  description: "Factures réglées et en attente du deuxième trimestre",
  origine: "Externe",
  destination: "Direction & Finances",
  formatPapier: true,
  formatElectronique: true,
  dp: true,
  cScore: 3, iScore: 4, aScore: 3, tScore: 3,
  sensibilite: 4,
  impactOp: 3, impactConf: 4, impactRep: 3, impactFin: 5,
  probabilite: 3, exposition: 3, attenuation: 2,
  risqueBrut: 20, risqueResiduel: 9, risqueAccepte: false,
  analyseRisque: "Accès limité + stockage chiffré",
  mesuresExistantes: "ERP Sécurisé, sauvegarde hors-site",
  risk: "Élevé",
  classification: "Secret",
  conformite: "Non Conforme",
  createdAt: days(36),
  processus: "Budgétisation",
},
{
  id: "demo-14",
  name: "Programme Formation RH 2025",
  department: "Ressources Humaines",
  owner: "Responsable Formation",
  description: "Plan des formations internes pour l'année 2025",
  origine: "Interne",
  destination: "Tous employés",
  formatPapier: false,
  formatElectronique: true,
  dp: false,
  cScore: 2, iScore: 2, aScore: 3, tScore: 2,
  sensibilite: 2,
  impactOp: 2, impactConf: 2, impactRep: 2, impactFin: 2,
  probabilite: 2, exposition: 2, attenuation: 2,
  risqueBrut: 8, risqueResiduel: 4, risqueAccepte: true,
  analyseRisque: "Diffusion limitée en interne",
  mesuresExistantes: "Intranet sécurisé",
  risk: "Faible",
  classification: "Interne",
  conformite: "Conforme",
  createdAt: days(40),
  processus: "Paie",
},
{
  id: "demo-15",
  name: "Étude de Marché - Afrique du Nord",
  department: "Marketing",
  owner: "Dépt. Marketing",
  description: "Analyse des tendances et comportements des consommateurs",
  origine: "Externe",
  destination: "Marketing & DG",
  formatPapier: false,
  formatElectronique: true,
  dp: false,
  cScore: 3, iScore: 3, aScore: 3, tScore: 2,
  sensibilite: 3,
  impactOp: 2, impactConf: 3, impactRep: 3, impactFin: 3,
  probabilite: 2, exposition: 2, attenuation: 2,
  risqueBrut: 12, risqueResiduel: 6, risqueAccepte: true,
  analyseRisque: "Conservation restreinte",
  mesuresExistantes: "VPN + Authentification forte",
  risk: "Moyen",
  classification: "Confidentiel",
  conformite: "Conforme",
  createdAt: days(43),
  processus: "Communication",
},
{
  id: "demo-16",
  name: "Plan de Continuité d’Activité",
  department: "Conformité & Sécurité",
  owner: "Cellule Risques",
  description: "Procédures en cas d’incidents majeurs",
  origine: "Interne",
  destination: "Direction & IT",
  formatPapier: true,
  formatElectronique: true,
  dp: true,
  cScore: 5, iScore: 4, aScore: 4, tScore: 4,
  sensibilite: 5,
  impactOp: 5, impactConf: 5, impactRep: 5, impactFin: 5,
  probabilite: 3, exposition: 3, attenuation: 2,
  risqueBrut: 25, risqueResiduel: 12, risqueAccepte: false,
  analyseRisque: "Audit annuel, test PCA",
  mesuresExistantes: "Datacenter secondaire, PRA",
  risk: "Élevé",
  classification: "Très Secret",
  conformite: "Non Conforme",
  createdAt: days(45),
  processus: "Audit Sécurité",
},
{
  id: "demo-17",
  name: "Manuel Qualité v2",
  department: "Direction Générale",
  owner: "DG",
  description: "Normes ISO internes et indicateurs qualité",
  origine: "Interne",
  destination: "Tous départements",
  formatPapier: false,
  formatElectronique: true,
  dp: false,
  cScore: 3, iScore: 3, aScore: 3, tScore: 3,
  sensibilite: 3,
  impactOp: 3, impactConf: 3, impactRep: 3, impactFin: 3,
  probabilite: 2, exposition: 2, attenuation: 2,
  risqueBrut: 12, risqueResiduel: 6, risqueAccepte: true,
  analyseRisque: "Mises à jour régulières",
  mesuresExistantes: "Certification ISO 9001",
  risk: "Moyen",
  classification: "Interne",
  conformite: "Conforme",
  createdAt: days(50),
  processus: "Stratégie",
}


];

// Lazy-load Prisma only when not in demo
let prisma;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    // DEMO MODE
    if (IS_DEMO) {
      if (id) {
        const one = demoAssets.find((a) => a.id === id) || null;
        return new Response(JSON.stringify(one), { status: 200 });
      }
      // sort newest first
      const list = [...demoAssets].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return new Response(JSON.stringify(list), { status: 200 });
    }

    // REAL DB MODE
    const db = await getPrisma();

    if (id) {
      const asset = await db.asset.findUnique({ where: { id } });
      return new Response(JSON.stringify(asset), { status: 200 });
    }

    const assets = await db.asset.findMany({
      orderBy: { createdAt: "desc" },
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
      },
    });

    return new Response(JSON.stringify(assets), { status: 200 });
  } catch (error) {
    console.error("❌ ERROR in /api/assets GET:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Map department -> processus
    const departmentToProcessus = {
      "Ressources Humaines": "Paie",
      Finances: "Budgétisation",
      Informatique: "Support IT",
      Juridique: "Conformité Légale",
      "Direction Générale": "Stratégie",
      Marketing: "Communication",
      "Conformité & Sécurité": "Audit Sécurité",
      "Opérations": "Gestion Courante",
    };
    const processus = departmentToProcessus[body.department] || "Autre";

    // Auto-calc conformité
    let conformite = "Non Conforme";
    const rr = parseInt(body.risqueResiduel);
    const rb = parseInt(body.risqueBrut);
    if (!Number.isNaN(rr) && !Number.isNaN(rb)) {
      conformite = rr <= rb / 2 ? "Conforme" : "Non Conforme";
    }

    // DEMO MODE: return a fake created object so UI keeps working
    if (IS_DEMO) {
      const fake = {
        id: "demo-" + Math.random().toString(36).slice(2, 9),
        ...body,
        processus,
        conformite,
        createdAt: new Date().toISOString(),
      };
      return new Response(JSON.stringify(fake), { status: 201 });
    }

    // REAL DB MODE
    const db = await getPrisma();
    const asset = await db.asset.create({
      data: {
        ...body,
        processus,
        conformite,
      },
    });

    return new Response(JSON.stringify(asset), { status: 201 });
  } catch (error) {
    console.error("❌ ERROR in /api/assets POST:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

