'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  momentDate: string
  uploadDate: string
  tags: string[]
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos?limit=100')
        const data = await response.json()
        setPhotos(data.photos)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return
    }

    setDeleting(id)

    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPhotos(photos.filter((p) => p.id !== id))
      } else {
        alert('Failed to delete photo')
      }
    } catch (error) {
      console.error('Error deleting photo:', error)
      alert('Failed to delete photo')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return <div className="text-gray-600">Loading photos...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Photos</h1>
        <Link
          href="/admin/photos/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Upload Photo
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No photos yet</p>
          <Link
            href="/admin/photos/create"
            className="text-blue-600 hover:text-blue-700"
          >
            Upload your first photo
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden rounded-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Caption
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Moment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {photos.map((photo) => (
                <tr key={photo.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative w-16 h-16">
                      <Image
                        src={photo.imageUrl}
                        alt={photo.caption}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                    {photo.caption}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(photo.momentDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(photo.uploadDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Link
                      href={`/admin/photos/edit/${photo.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(photo.id)}
                      disabled={deleting === photo.id}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      {deleting === photo.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
