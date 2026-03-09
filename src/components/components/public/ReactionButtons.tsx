'use client'

import { useEffect, useState } from 'react'

interface Reaction {
  id: string
  type: string
  count: number
}

interface ReactionButtonsProps {
  photoId: string
}

const REACTION_EMOJIS: Record<string, string> = {
  heart: '❤️',
  wow: '😮',
  laugh: '😂',
  cry: '😢',
  fire: '🔥',
}

export default function ReactionButtons({ photoId }: ReactionButtonsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [loading, setLoading] =useState(true)
  const [addingReaction, setAddingReaction] = useState<string | null>(null)

  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/reactions?photoId=${photoId}`)
        const data = await response.json()
        setReactions(data)
      } catch (error) {
        console.error('Error fetching reactions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReactions()
  }, [photoId])

  const handleReaction = async (type: string) => {
    setAddingReaction(type)

    try {
      const response = await fetch('/api/reactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          type,
        }),
      })

      if (response.ok) {
        const newReaction = await response.json()

        // Update local state
        setReactions((prev) => {
          const existing = prev.find((r) => r.type === type)
          if (existing) {
            return prev.map((r) =>
              r.type === type ? { ...r, count: newReaction.count } : r
            )
          } else {
            return [...prev, newReaction]
          }
        })
      }
    } catch (error) {
      console.error('Error adding reaction:', error)
    } finally {
      setAddingReaction(null)
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading reactions...</div>
  }

  return (
    <div className="space-y-3">
      <p className="text-gray-300 font-semibold text-sm">React to this photo</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(REACTION_EMOJIS).map(([type, emoji]) => {
          const count =
            reactions.find((r) => r.type === type)?.count || 0

          return (
            <button
              key={type}
              onClick={() => handleReaction(type)}
              disabled={addingReaction === type}
              className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm transition-colors ${
                count > 0
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              } disabled:opacity-50`}
            >
              <span>{emoji}</span>
              {count > 0 && <span>{count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
