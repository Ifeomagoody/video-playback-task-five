
"use client"

import { useState } from "react"
import VideoRecorder from "@/components/video-recorder"
import VideoReview from "@/components/video-review"

export default function RecordPage() {
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const questions = [
    "Tell us about yourself and your struggles as regards the MentorLed assessments so far.",
    "What are your greatest strengths and weaknesses?",
    "Why do you want to be part of MentorLed?",
  ]

  const handleRecordingComplete = (blob: Blob) => {
    setRecordedBlob(blob)
    setIsReviewing(true)
  }

  const handleReRecord = () => {
    setRecordedBlob(null)
    setIsReviewing(false)
  }

  const handleSubmit = () => {
 
    alert("Video response submitted successfully!")

    
    if (currentQuestion < questions.length - 1) { // User can move to the next question otherwise click finish
      setCurrentQuestion(currentQuestion + 1)
      setRecordedBlob(null)
      setIsReviewing(false)
    } else {
      
      window.location.href = "/thank-you"   // this message is displayed when the user has completed the interview 
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Question {currentQuestion + 1}/{questions.length}
        </h1>
        <p className="text-lg mb-6 text-gray-700">{questions[currentQuestion]}</p>

        {!isReviewing ? (
          <VideoRecorder onRecordingComplete={handleRecordingComplete} />
        ) : (
          <VideoReview recordedBlob={recordedBlob} onReRecord={handleReRecord} onSubmit={handleSubmit} />
        )}
      </div>
    </div>
  )
}

