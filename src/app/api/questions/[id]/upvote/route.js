import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req, { params }) {
  try {
    const { id } = await params
    const question = await prisma.question.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    })
    return NextResponse.json(question)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}





