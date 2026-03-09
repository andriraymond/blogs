'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Photo {
  id: string
  imageUrl: string
  caption: string
  alt: string
  momentDate: string
  uploadDate: string
  tags: string[]
}

interface PhotoCardProps {
  photo: Photo
  onClick: () => void
}

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <motion.div
      className="group cursor-pointer"
      onClick={onClick}
      whileHover={{ y: -4 }}
    >
      <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-auto h-80">
        <Image
          src={photo.imageUrl}
          alt={photo.alt}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={false}
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100">
          <div className="text-white">
            <p className="font-semibold text-sm line-clamp-2">
              {photo.caption}
            </p>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 mb-6">
        <p className="text-sm font-medium text-gray-900 line-clamp-2">
          {photo.caption}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(photo.momentDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
        {photo.tags && photo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {photo.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
