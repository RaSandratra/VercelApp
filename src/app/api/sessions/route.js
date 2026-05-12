import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')

    const sessions = await prisma.session.findMany({
      where: ids ? { id: { in: ids.split(',') } } : undefined,
      include: { speakers: true, event: true },
      orderBy: { startTime: 'asc' },
    })
    return NextResponse.json(sessions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}





