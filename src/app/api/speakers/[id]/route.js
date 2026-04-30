import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req, { params }) {
  const { id } = await params
  const speaker = await prisma.speaker.findUnique({ where: { id } })
  if (!speaker) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(speaker)
}