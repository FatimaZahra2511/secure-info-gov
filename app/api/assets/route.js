import { NextResponse } from "next/server";
import { getDemoAssets } from "@/app/demo/assets";

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
    createdAt: new Date().toISOString(),
    processus: "Paie",
  },
  {
    id: "demo-2",
    name: "Budget Prévisionnel",
    department: "Finances",
    owner: "Service Financier",
    description: "Budget 2025 – version 1",
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
    createdAt: new Date().toISOString(),
    processus: "Budgétisation",
  },
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
  const all = getDemoAssets();
  if (id) {
    const one = all.find((a) => a.id === id) || null;
    return new Response(JSON.stringify(one), { status: 200 });
  }
  const list = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
