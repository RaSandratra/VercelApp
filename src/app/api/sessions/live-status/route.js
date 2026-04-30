import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSessionLive } from '@/lib/sessionUtils'

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []
    if (!ids.length) return NextResponse.json({})
    const sessions = await prisma.session.findMany({
      where: { id: { in: ids } },
      select: { id: true, startTime: true, endTime: true },
    })
    const liveMap = Object.fromEntries(
      sessions.map(s => [s.id, isSessionLive(s.startTime, s.endTime)])
    )
    return NextResponse.json(liveMap)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
