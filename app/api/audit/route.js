// src/app/api/audit/route.js
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Reuse a global PrismaClient if present (prevents too many connections)
const prisma = globalThis.prisma || new PrismaClient()
if (!globalThis.prisma) globalThis.prisma = prisma

export async function GET() {
  try {
    const all = await prisma.audit.findMany({
      orderBy: { timestamp: 'desc' },
    })
    return NextResponse.json(all)
  } catch (err) {
    console.error('GET /api/audit error', err)
    return NextResponse.json(
      { error: 'Erreur lors de la lecture des audits' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, docId, nom } = await request.json()
    if (!action || !docId || nom === undefined) {
      return NextResponse.json(
        { error: 'Champs manquants : action, docId, nom' },
        { status: 400 }
      )
    }
    const entry = await prisma.audit.create({
      data: { action, docId, nom },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch (err) {
    console.error('POST /api/audit error', err)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l’audit' },
      { status: 500 }
    )
  }
}
