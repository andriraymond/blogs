import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { withAdminAuth } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const photo = await db.photo.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: { createdAt: 'desc' },
        },
        reactions: true,
      },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(photo, { status: 200 })
  } catch (error) {
    console.error('Error fetching photo:', error)
    return NextResponse.json(
      { error: 'Failed to fetch photo' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await withAdminAuth(req, 'editor')

    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const { caption, alt, momentDate, tags } = await req.json()

    const photo = await db.photo.update({
      where: { id },
      data: {
        ...(caption && { caption }),
        ...(alt && { alt }),
        ...(momentDate && { momentDate: new Date(momentDate) }),
        ...(tags && { tags }),
      },
      include: {
        comments: true,
        reactions: true,
      },
    })

    return NextResponse.json(photo, { status: 200 })
  } catch (error) {
    console.error('Error updating photo:', error)
    return NextResponse.json(
      { error: 'Failed to update photo' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await withAdminAuth(req, 'admin')

    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Only admins can delete photos' },
        { status: 403 }
      )
    }

    const { id } = await params

    const photo = await db.photo.findUnique({
      where: { id },
    })

    if (!photo) {
      return NextResponse.json(
        { error: 'Photo not found' },
        { status: 404 }
      )
    }

    // Delete from Cloudinary
    try {
      await deleteFromCloudinary(photo.publicId)
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error)
      // Continue with DB deletion even if Cloudinary fails
    }

    // Delete from database
    await db.photo.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Photo deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting photo:', error)
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    )
  }
}
