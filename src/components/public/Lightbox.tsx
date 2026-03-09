'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import CommentSection from './CommentSection'
import ReactionButtons from './ReactionButtons'

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

interface LightboxProps {
  photo: Photo
  onClose: () => void
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}

export default function Lightbox({
  photo,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
}: LightboxProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/90 z-50 flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="flex-1 flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
        >
          {/* Image Section */}
          <div className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
            {/* Navigation Buttons */}
            {hasPrev && (
              <button
                onClick={() => {
                  onPrev()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                aria-label="Previous photo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {hasNext && (
              <button
                onClick={() => {
                  onNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
                aria-label="Next photo"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            <div className="relative w-full h-96 md:h-full">
              <Image
                src={photo.imageUrl}
                alt={photo.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 70vw"
                priority
              />
            </div>
          </div>

          {/* Sidebar - Photo Info */}
          <div className="w-full md:w-96 bg-gray-900 overflow-y-auto flex flex-col p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white md:relative md:mb-4 md:ml-auto"
              aria-label="Close lightbox"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Photo Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">
                {photo.caption}
              </h2>

              {photo.alt && (
                <p className="text-gray-300 text-sm mb-4">{photo.alt}</p>
              )}

              <div className="space-y-3 mb-6 text-sm text-gray-400">
                <p>
                  <span className="text-gray-300 font-semibold">Moment Date:</span>{' '}
                  {new Date(photo.momentDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p>
                  <span className="text-gray-300 font-semibold">
                    Upload Date:
                  </span>{' '}
                  {new Date(photo.uploadDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Tags */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="mb-6">
                  <p className="text-gray-300 font-semibold text-sm mb-2">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {photo.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs bg-gray-800 text-gray-200 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reactions */}
              <div className="mb-6">
                <ReactionButtons photoId={photo.id} />
              </div>
            </div>

            {/* Comments Section */}
            <div className="border-t border-gray-700 pt-4">
              <CommentSection photoId={photo.id} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
