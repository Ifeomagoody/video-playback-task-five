
"use client"

import { useRef, useEffect } from "react"

interface VideoReviewProps {
  recordedBlob: Blob | null
  onReRecord: () => void
  onSubmit: () => void
}

export default function VideoReview({ recordedBlob, onReRecord, onSubmit }: VideoReviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && recordedBlob) {
      videoRef.current.src = URL.createObjectURL(recordedBlob)
    }

    return () => {
      if (videoRef.current) {
        URL.revokeObjectURL(videoRef.current.src)
      }
    }
  }, [recordedBlob])

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Review Your Response</h2>

      <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-6">
        <video ref={videoRef} controls className="w-full h-full" autoPlay />
      </div>

      <div className="flex gap-4">
        <button
          onClick={onReRecord}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Record Again
        </button>

        <button
          onClick={onSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Submit Response
        </button>
      </div>
    </div>
  )
}

