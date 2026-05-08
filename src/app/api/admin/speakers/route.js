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
    const { name, bio, photoUrl, links } = await req.json()
    if (!name) return NextResponse.json({ error: 'Le nom est requis' }, { status: 400 })
    const speaker = await prisma.speaker.create({
      data: { name, bio: bio || null, photoUrl: photoUrl || null, links: links || null },
    })
    return NextResponse.json(speaker, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}





