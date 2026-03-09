'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Gallery from '@/components/public/Gallery'
import SearchBar from '@/components/public/SearchBar'
import FilterBar from '@/components/public/FilterBar'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  alt: string
  momentDate: string
  uploadDate: string
  tags: string[]
  comments?: any[]
  reactions?: any[]
}

interface FetchParams {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  sortBy?: string
  searchQuery?: string
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'search'>('all')
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    sortBy: 'newest-upload',
  })
  const observerTarget = useRef<HTMLDivElement>(null)

  // Fetch photos from API
  const fetchPhotos = useCallback(
    async (params: FetchParams) => {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams({
          page: String(params.page || 1),
          limit: String(params.limit || 20),
        })

        if (searchQuery) {
          queryParams.append('q', searchQuery)
          const response = await fetch(`/api/search?${queryParams}`)
          const data = await response.json()
          console.log('Search response:', data)
          
          if (params.page === 1) {
            setPhotos(data.photos)
          } else {
            setPhotos((prev) => [...prev, ...data.photos])
          }
          setHasMore(data.pagination.hasNextPage)
        } else {
          if (params.startDate) queryParams.append('startDate', params.startDate)
          if (params.endDate) queryParams.append('endDate', params.endDate)
          if (params.sortBy) queryParams.append('sortBy', params.sortBy)

          const response = await fetch(`/api/photos?${queryParams}`)
          const data = await response.json()
          console.log('Photos response:', data)
          
          if (params.page === 1) {
            setPhotos(data.photos)
          } else {
            setPhotos((prev) => [...prev, ...data.photos])
          }
          setHasMore(data.pagination.hasNextPage)
        }
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setLoading(false)
      }
    },
    [searchQuery]
  )

  // Initial load
  useEffect(() => {
    setPage(1)
    fetchPhotos({ page: 1 })
  }, [searchQuery, filters, fetchPhotos])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        const nextPage = page + 1
        setPage(nextPage)
        fetchPhotos({ page: nextPage })
      }
    })

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [page, hasMore, loading, fetchPhotos])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setActiveTab(query ? 'search' : 'all')
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Moments of My Life</h1>
          <p className="text-gray-300 text-lg">A personal photo memory gallery</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => {
              setSearchQuery('')
              setActiveTab('all')
              setPage(1)
              fetchPhotos({ page: 1 })
            }}
            className={`px-4 py-2 font-medium ${
              activeTab === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Photos
          </button>
          {searchQuery && (
            <button
              className={`px-4 py-2 font-medium text-blue-600 border-b-2 border-blue-600`}
            >
              Search Results ({photos.length})
            </button>
          )}
        </div>

        {/* Filters (only show in All Photos tab) */}
        {!searchQuery && <FilterBar onFilterChange={setFilters} />}

        {/* Gallery */}
        {photos.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No photos found for your search.' : 'No photos yet.'}
            </p>
          </div>
        ) : (
          <>
            <Gallery photos={photos} />

            {/* Infinite scroll observer */}
            <div ref={observerTarget} className="py-8 text-center">
              {loading && <p className="text-gray-500">Loading more photos...</p>}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
