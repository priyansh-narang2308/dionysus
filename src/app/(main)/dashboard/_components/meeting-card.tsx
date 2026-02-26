"use client"

import { Card } from "@/components/ui/card"
import { useDropzone } from "react-dropzone"
import React, { useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import {
  PresentationIcon,
  Upload,
  FileAudio,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { toast } from "sonner"
import { api } from "@/trpc/react"
import useProject from "@/hooks/use-project"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

const MeetingCard = () => {

  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [fileName, setFileName] = useState<string | null>(null)

  const router = useRouter()
  const { projectId, project } = useProject()
  const uploadMeeting = api.project.uploadMeeting.useMutation()

  const processMeeting = useMutation({
    mutationFn: async (data: { meetingUrl: string, projectId: string, meetingId: string }) => {
      const { meetingUrl, projectId, meetingId } = data
      const respoknse = await axios.post("/api/process-meeting", {
        meetingUrl,
        projectId,
        meetingId
      })
      if (respoknse.status === 200) {
        toast.success("Meeting processed successfully")
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return respoknse.data
    }
  })

  const { startUpload } = useUploadThing("audioUploader", {
    onClientUploadComplete: (res) => {
      if (!project) return
      console.log("Upload complete:", res)
      if (res?.[0]) {
        uploadMeeting.mutate({
          projectId,
          meetingUrl: res[0].url,
          name: fileName ?? res[0].name
        }, {
          onSuccess: () => {
            toast.success(`Meeting Uploaded and Recorded!`)
            router.push("/meetings")
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            processMeeting.mutateAsync({
              meetingUrl: res[0]?.url ?? "",
              projectId,
              meetingId: uploadMeeting.data?.id ?? ""
            })
          },
          onError: (error) => {
            console.error("Mutation error:", error)
            toast.error("Failed to record meeting")
          }
        })
      }
      setIsUploading(false)
      setProgress(0)
    },
    onUploadProgress: (p) => {
      setProgress(p)
    },
    onUploadError: (e) => {
      console.error(e)
      toast.error("Upload failed")
      setIsUploading(false)
      setProgress(0)
      setFileName(null)
    }
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"]
    },
    multiple: false,
    maxSize: 50_000_000,

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onDrop: async acceptedFiles => {

      const file = acceptedFiles[0]
      if (!file) return

      setFileName(file.name)
      setIsUploading(true)
      setProgress(0)

      try {
        await startUpload(acceptedFiles)
      } catch (err) {
        console.error("error starting upload", err)
      }
    }
  })

  return (
    <Card
      {...getRootProps()}
      className={`
        col-span-2
        relative
        flex flex-col
        items-center
        justify-center
        gap-5
        p-10
        border-2
        border-dashed
        transition-all
        duration-200
        cursor-pointer
        hover:border-blue-500/60
        hover:bg-blue-50/30
        ${isDragActive ? "border-blue-500 bg-blue-50 scale-[1.01]" : ""}
      `}
    >
      <input {...getInputProps()} />
      <div className="w-24 h-24">
        {isUploading ? (
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            styles={buildStyles({
              pathColor: "#2563eb",
              textColor: "#2563eb",
              trailColor: "#e5e7eb",
              strokeLinecap: "round",
              pathTransitionDuration: 0.3,
            })}
          />
        ) : (
          <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-100">
            {fileName ? (
              <FileAudio className="h-10 w-10 text-blue-600 animate-pulse" />
            ) : (
              <PresentationIcon className="h-10 w-10 text-blue-600 animate-bounce" />
            )}
          </div>
        )}
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold">
          {isUploading
            ? "Uploading meeting..."
            : "Upload Meeting Recording"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          {isUploading
            ? "Please wait while your audio is being uploaded"
            : fileName ?? "Drag & drop your audio file or click below"}
        </p>
      </div>
      {!isUploading && (
        <Button
          type="button"
          variant="default"
          className="gap-2 bg-blue-600 cursor-pointer hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Select Audio File
        </Button>
      )}
      {!isUploading && (
        <p className="text-xs text-muted-foreground">
          Supports MP3, WAV, M4A • Max 50MB
        </p>
      )}
    </Card>
  )
}

export default MeetingCard