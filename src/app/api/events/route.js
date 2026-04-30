import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')

    // BUG FIX: La page /favourites appelle /api/sessions?ids=... mais cette route n'existait pas.
    // Elle appelait /api/events. Ajout du support du paramètre ids.
    const events = await prisma.event.findMany({
      ...(ids ? { where: { id: { in: ids.split(',') } } } : {}),
      orderBy: { startDate: 'desc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
