import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAdminAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'newest-upload'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const skip = (page - 1) * limit

    // Build filter
    const where: any = { status: 'published' }

    if (startDate || endDate) {
      where.momentDate = {}
      if (startDate) {
        where.momentDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.momentDate.lte = new Date(endDate)
      }
    }

    // Determine sort order
    const orderBy: any = {}
    if (sortBy === 'newest-moment') {
      orderBy.momentDate = 'desc'
    } else {
      orderBy.uploadDate = 'desc'
    }

    const [photos, total] = await Promise.all([
      db.photo.findMany({
        where,
        orderBy,
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
      db.photo.count({ where }),
    ])

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json(
      {
        photos,
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
    console.error('Error fetching photos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photos' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { authorized } = await withAdminAuth(req, 'editor')

    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { imageUrl, publicId, caption, alt, momentDate, tags } = await req.json()

    if (!imageUrl || !publicId || !caption || !alt || !momentDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const photo = await db.photo.create({
      data: {
        imageUrl,
        publicId,
        caption,
        alt,
        momentDate: new Date(momentDate),
        tags: tags || [],
        status: 'published',
      },
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Error creating photo:', error)
    return NextResponse.json(
      { error: 'Failed to create photo' },
      { status: 500 }
    )
  }
}
