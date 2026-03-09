import React from 'react'
import Link from 'next/link'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p>&copy; 2024 Moments of My Life. All rights reserved.</p>
            <Link
              href="/admin/login"
              className="text-gray-300 hover:text-white text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
