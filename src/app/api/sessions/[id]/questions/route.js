import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isSessionLive } from '@/lib/sessionUtils'

// BUG FIX: La route était sous /api/sessions/live-status/[id]/questions
// mais QuestionSection appelait /api/sessions/[id]/questions.
// Créé la route au bon chemin.
export async function GET(req, { params }) {
  try {
    const { id } = await params
    const questions = await prisma.question.findMany({
      where: { sessionId: id },
      orderBy: { upvotes: 'desc' },
    })
    return NextResponse.json(questions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req, { params }) {
  try {
    const { id } = await params
    const session = await prisma.session.findUnique({ where: { id } })
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isSessionLive(session.startTime, session.endTime)) {
      return NextResponse.json({ error: 'Session not live' }, { status: 403 })
    }
    const { content, authorName } = await req.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 })
    }
    const question = await prisma.question.create({
      data: { content, authorName: authorName || null, sessionId: id },
    })
    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
