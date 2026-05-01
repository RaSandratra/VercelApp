import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSessionLive } from '@/lib/sessionUtils'

export async function GET(req, { params }) {
  const { id } = await params
  const questions = await prisma.question.findMany({
    where: { sessionId: id },
    orderBy: { upvotes: 'desc' },
  })
  return NextResponse.json(questions)
}

export async function POST(req, { params }) {
  const { id } = await params
  const session = await prisma.session.findUnique({ where: { id } })
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  if (!isSessionLive(session.startTime, session.endTime))
    return NextResponse.json({ error: 'Session not live' }, { status: 403 })
  const { content, authorName } = await req.json()
  if (!content?.trim())
    return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 })
  const question = await prisma.question.create({
    data: { content, authorName: authorName || null, sessionId: id },
  })
  return NextResponse.json(question, { status: 201 })
}