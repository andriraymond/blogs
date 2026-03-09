'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  alt: string
  momentDate: string
  tags: string[]
}

export default function EditPhoto() {
  const router = useRouter()
  const params = useParams()
  const photoId = params.id as string

  const [photo, setPhoto] = useState<Photo | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [caption, setCaption] = useState('')
  const [alt, setAlt] = useState('')
  const [momentDate, setMomentDate] = useState('')
  const [tags, setTags] = useState('')

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await fetch(`/api/photos/${photoId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch photo')
        }
        const data = await response.json()
        setPhoto(data)
        setCaption(data.caption)
        setAlt(data.alt)
        setMomentDate(data.momentDate.split('T')[0])
        setTags(data.tags.join(', '))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load photo')
      } finally {
        setLoading(false)
      }
    }

    if (photoId) {
      fetchPhoto()
    }
  }, [photoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!caption || !alt || !momentDate) {
      setError('All fields are required')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caption,
          alt,
          momentDate,
          tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update photo')
      }

      router.push('/admin/photos')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading photo...</div>
  }

  if (!photo) {
    return <div className="text-red-600">Photo not found</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Photo</h1>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        {/* Image Preview (Read-only) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image src={photo.imageUrl} alt={photo.alt} fill className="object-cover" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          )}

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
              placeholder="Enter tags separated by commas"
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
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
