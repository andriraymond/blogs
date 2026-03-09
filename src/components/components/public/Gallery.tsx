'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Masonry from 'react-masonry-css'
import PhotoCard from './PhotoCard'
import Lightbox from './Lightbox'

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

interface GalleryProps {
  photos: Photo[]
}

export default function Gallery({ photos }: GalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo)
    setSelectedIndex(index)
  }

  const closeLightbox = () => {
    setSelectedPhoto(null)
  }

  const goToNext = () => {
    if (selectedIndex < photos.length - 1) {
      const nextIndex = selectedIndex + 1
      setSelectedPhoto(photos[nextIndex])
      setSelectedIndex(nextIndex)
    }
  }

  const goToPrev = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      setSelectedPhoto(photos[prevIndex])
      setSelectedIndex(prevIndex)
    }
  }

  const breakpoints = {
    default: 3,
    1536: 3,
    1280: 3,
    1024: 2,
    768: 2,
    640: 1,
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Masonry
          breakpointCols={breakpoints}
          className="masonry-grid flex gap-6"
          columnClassName="masonry-grid-column"
        >
          {photos.map((photo, index) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              transition={{ duration: 0.5 }}
            >
              <PhotoCard
                photo={photo}
                onClick={() => openLightbox(photo, index)}
              />
            </motion.div>
          ))}
        </Masonry>
      </motion.div>

      {/* Lightbox */}
      {selectedPhoto && (
        <Lightbox
          photo={selectedPhoto}
          onClose={closeLightbox}
          onNext={goToNext}
          onPrev={goToPrev}
          hasNext={selectedIndex < photos.length - 1}
          hasPrev={selectedIndex > 0}
        />
      )}

      <style jsx>{`
        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .masonry-grid-column {
          padding: 0;
        }

        @media (max-width: 640px) {
          .masonry-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (min-width: 640px) and (max-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </>
  )
}
