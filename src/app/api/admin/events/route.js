import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { title, description, startDate, endDate, location } = await req.json()
    // BUG FIX: Validation des champs obligatoires
    if (!title || !startDate || !endDate || !location) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })
    }
    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
      },
    })
    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
