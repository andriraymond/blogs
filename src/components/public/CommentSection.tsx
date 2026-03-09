'use client'

import { useEffect, useState } from 'react'

interface Comment {
  id: string
  authorName: string
  text: string
  createdAt: string
}

interface CommentSectionProps {
  photoId: string
}

export default function CommentSection({ photoId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [authorName, setAuthorName] = useState('')
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?photoId=${photoId}`)
        const data = await response.json()
        setComments(data)
      } catch (error) {
        console.error('Error fetching comments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [photoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!authorName.trim() || !text.trim()) {
      return
    }

    setPosting(true)

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          photoId,
          authorName: authorName.trim(),
          text: text.trim(),
        }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setComments([newComment, ...comments])
        setAuthorName('')
        setText('')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setPosting(false)
    }
  }

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading comments...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Comments ({comments.length})</h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="text"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Your name"
          className="w-full px-3 py-2 bg-gray-800 text-white rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex space-x-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={posting || !authorName.trim() || !text.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {posting ? '...' : 'Post'}
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-800 rounded p-3">
              <p className="text-white text-sm font-semibold">
                {comment.authorName}
              </p>
              <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
