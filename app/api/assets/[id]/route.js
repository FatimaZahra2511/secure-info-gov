import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const asset = await prisma.asset.findUnique({ where: { id: params.id } });
  if (!asset) return new Response('Not found', { status: 404 });
  return new Response(JSON.stringify(asset), { status: 200 });
}

export async function PUT(request, { params }) {
  const data = await request.json();
  const updated = await prisma.asset.update({
    where: { id: params.id },
    data,
  });
  return new Response(JSON.stringify(updated), { status: 200 });
}

export async function DELETE(request, { params }) {
  await prisma.asset.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
