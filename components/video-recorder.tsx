
"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import Webcam from "react-webcam"
import RecordRTC from "recordrtc"

interface VideoRecorderProps {
  onRecordingComplete: (blob: Blob) => void
}

export default function VideoRecorder({ onRecordingComplete  }: VideoRecorderProps) {
  const webcamRef = useRef<Webcam>(null)
  const mediaRecorderRef = useRef<RecordRTC | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null)

  const MAX_RECORDING_TIME = 120 // this is equivalent to 2 minutes in seconds

  useEffect(() => {
    if(!navigator )return
    navigator.mediaDevices  // allow camera permission before proceeding
      .getUserMedia({ video: true, audio: true })
      .then(() => setCameraPermission(true))
      .catch(() => setCameraPermission(false))

    return () => {
      
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stopRecording()
      }
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    
    if (countdown !== null && countdown > 0) {  // this is where the timer function is declared 
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else if (countdown === 0) {
      startRecording()
      setCountdown(null)
    }

    
    if (isRecording) {  // this is a function that times the recording 
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [countdown, isRecording, recordingTime])

  const handleStartRecording = useCallback(() => {
    setCountdown(3) // it was set to 3 seconds countdown
  }, [])

  const startRecording = useCallback(() => {
    if (typeof window === "undefined") return; // Prevent execution during SSR
    setIsRecording(true)
    setRecordingTime(0)

    const stream = webcamRef.current?.video?.srcObject as MediaStream
    if (stream) {
      import("recordrtc").then(({ default: RecordRTC }) => {
        mediaRecorderRef.current = new RecordRTC(stream, {
          type: "video",
          mimeType: "video/webm",
          bitsPerSecond: 128000,
        });

        mediaRecorderRef.current.startRecording();
      });
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      setIsRecording(false)

      mediaRecorderRef.current.stopRecording(() => {
        const blob = mediaRecorderRef.current?.getBlob()
        if (blob) {
          onRecordingComplete(blob)
        }
      })
    }
  }, [isRecording, onRecordingComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (cameraPermission === false) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <h3 className="text-xl font-semibold text-red-600 mb-2">Camera Access Required</h3>
        <p className="mb-4">Please allow camera and microphone access to record your response.</p>
        <button
          onClick={() => setCameraPermission(null)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <Webcam
          audio
          ref={webcamRef}
          className="w-full h-full object-cover"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
          }}
        />

        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-7xl font-bold">{countdown}</span>
          </div>
        )}

        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-black bg-opacity-50 px-3 py-1 rounded-full">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-white font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}
      </div>

      <div className="flex gap-4 mt-2">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            disabled={countdown !== null}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="10" r="6" />
            </svg>
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <rect x="6" y="6" width="8" height="8" />
            </svg>
            Stop Recording
          </button>
        )}
      </div>

      <div className="mt-6 text-gray-600 text-sm">
        <p>Tips:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Ensure you are in a quiet environment</li>
          <li>Speak proficiently and maintain eye contact with the camera</li>
          <li>You can record your answer again if needed</li>
          <li>Maximum recording time is not more than 2 minutes</li>
        </ul>
      </div>
    </div>
  )
}

