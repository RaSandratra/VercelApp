import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// BUG FIX: Ce fichier était nommé page.jsx au lieu de route.js, et placé dans /api/events/[id]/edit/
// au lieu de /api/events/[id]/. Corrigé et déplacé au bon endroit.
export async function GET(req, { params }) {
  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(event)
}
