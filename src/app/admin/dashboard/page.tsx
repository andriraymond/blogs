'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface StatsData {
  totalPhotos: number
  totalComments: number
  totalReactions: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatsData>({
    totalPhotos: 0,
    totalComments: 0,
    totalReactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch stats from API endpoints
    const fetchStats = async () => {
      try {
        // For extended CMS, you'd create dedicated stat endpoints
        // For now, we'll show placeholder data
        setStats({
          totalPhotos: 0,
          totalComments: 0,
          totalReactions: 0,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Photos
            </dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">
              {stats.totalPhotos}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Comments
            </dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">
              {stats.totalComments}
            </dd>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">
              Total Reactions
            </dt>
            <dd className="mt-1 text-3xl font-extrabold text-gray-900">
              {stats.totalReactions}
            </dd>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/photos/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload New Photo
            </Link>
            <Link
              href="/admin/photos"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Manage Photos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
