import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'


export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const sessions = await prisma.session.findMany({
      select: { room: true },
      distinct: ['room'],
      orderBy: { room: 'asc' },
    })
    const rooms = sessions
      .map(s => s.room)
      .filter(Boolean)
      .map(name => ({ name }))
    return NextResponse.json(rooms)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
