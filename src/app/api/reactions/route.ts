import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const VALID_REACTIONS = ['heart', 'wow', 'laugh', 'cry', 'fire']

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const photoId = searchParams.get('photoId')

    if (!photoId) {
      return NextResponse.json(
        { error: 'photoId is required' },
        { status: 400 }
      )
    }

    const reactions = await db.reaction.findMany({
      where: { photoId },
    })

    return NextResponse.json(reactions, { status: 200 })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reactions' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { photoId, type } = await req.json()

    if (!photoId || !type) {
      return NextResponse.json(
        { error: 'Missing photoId or reaction type' },
        { status: 400 }
      )
    }

    if (!VALID_REACTIONS.includes(type)) {
      return NextResponse.json(
        { error: `Invalid reaction type. Valid types: ${VALID_REACTIONS.join(', ')}` },
        { status: 400 }
      )
    }

    // Verify photo exists
    const photo = await db.photo.findUnique({
      where: { id: photoId },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Upsert reaction (increment count if exists, create if not)
    const reaction = await db.reaction.upsert({
      where: {
        photoId_type: {
          photoId,
          type,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        photoId,
        type,
        count: 1,
      },
    })

    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    console.error('Error creating reaction:', error)
    return NextResponse.json(
      { error: 'Failed to create reaction' },
      { status: 500 }
    )
  }
}
