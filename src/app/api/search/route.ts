import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (q.length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Search in caption and tags using regex
    const searchRegex = new RegExp(q, 'i')

    const [photos, total] = await Promise.all([
      db.photo.findMany({
        where: {
          status: 'published',
          OR: [
            { caption: { contains: q, mode: 'insensitive' } },
            { tags: { hasSome: [q] } },
          ],
        },
        orderBy: { uploadDate: 'desc' },
        skip,
        take: limit,
        include: {
          comments: {
            take: 3,
            orderBy: { createdAt: 'desc' },
          },
          reactions: true,
        },
      }),
      db.photo.count({
        where: {
          status: 'published',
          OR: [
            { caption: { contains: q, mode: 'insensitive' } },
            { tags: { hasSome: [q] } },
          ],
        },
      }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      {
        photos,
        query: q,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error searching photos:', error)
    return NextResponse.json(
      { error: 'Failed to search photos' },
      { status: 500 }
    )
  }
}
