'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Image from 'next/image'

interface UploadResponse {
  imageUrl: string
  publicId: string
}

export default function CreatePhoto() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [alt, setAlt] = useState('')
  const [momentDate, setMomentDate] = useState('')
  const [tags, setTags] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!file || !caption || !alt || !momentDate) {
      setError('All fields are required')
      return
    }

    setUploading(true)

    try {
      // Step 1: Upload to Cloudinary via server API
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const cloudinaryData = await uploadResponse.json()

      // Step 2: Save metadata to database
      const photoResponse = await fetch('/api/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: cloudinaryData.imageUrl,
          publicId: cloudinaryData.publicId,
          caption,
          alt,
          momentDate,
          tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      })

      if (!photoResponse.ok) {
        throw new Error('Failed to save photo metadata')
      }

      // Redirect to photos list
      router.push('/admin/photos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Photo</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            {preview ? (
              <div className="relative w-full h-64 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900 cursor-pointer"
              required
            />
          </div>

          {/* Caption */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption *
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              placeholder="Describe this moment..."
              required
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text *
            </label>
            <input
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              placeholder="Describe the image for accessibility"
              required
            />
          </div>

          {/* Moment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moment Date *
            </label>
            <input
              type="date"
              value={momentDate}
              onChange={(e) => setMomentDate(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-900"
              placeholder="Enter tags separated by commas (e.g., travel, family, summer)"
            />
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
