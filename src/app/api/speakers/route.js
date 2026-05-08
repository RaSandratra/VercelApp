import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const speakers = await prisma.speaker.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(speakers)
  } catch (error) {
    console.error('Erreur GET /api/speakers:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}




