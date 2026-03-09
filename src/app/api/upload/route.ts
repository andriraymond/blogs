import { NextRequest, NextResponse } from 'next/server'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { withAdminAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { authorized } = await withAdminAuth(request, 'editor')

    if (!authorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary (server-side, uses API credentials)
    const { imageUrl, publicId } = await uploadToCloudinary(file)

    return NextResponse.json({ imageUrl, publicId }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    )
  }
}
