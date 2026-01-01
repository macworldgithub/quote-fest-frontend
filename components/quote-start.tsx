"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, ArrowLeft, Loader2 } from "lucide-react"
import { analyzeBill } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface QuoteStartProps {
  onStartQuote: (quoteId: string) => void
  onCancel: () => void
}

export default function QuoteStart({ onStartQuote, onCancel }: QuoteStartProps) {
  const [customerType, setCustomerType] = useState<"Business" | "Residential" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (file: File | null) => {
    if (!file || !customerType) return

    setIsProcessing(true)
    try {
      const response = await analyzeBill(file, customerType)
      onStartQuote(response.id)
    } catch (error) {
      console.error("[v0] Bill analysis error:", error)
      toast({
        title: "Error analyzing bill",
        description: error instanceof Error ? error.message : "Failed to process bill",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  const handleUploadFile = () => {
    if (!customerType) return
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    handleFileSelect(file || null)
  }

  const handleTakePhoto = async () => {
    if (!customerType) {
      toast({
        title: "Select customer type first",
        description: "Please choose Business or Residential",
        variant: "destructive",
      })
      return
    }

    try {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = "image/*"
      input.capture = "environment"
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          handleFileSelect(file)
        }
      }
      input.click()
    } catch (error) {
      console.error("[v0] Camera error:", error)
      toast({
        title: "Camera not available",
        description: "Try uploading a file instead",
        variant: "destructive",
      })
    }
  }

  if (!customerType) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <h1 className="text-4xl font-bold text-foreground">QuoteFast Pro</h1>
            <p className="text-lg text-muted-foreground">Create a quote in 60-90 seconds</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground text-center">Who is this quote for?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setCustomerType("Business")}
                size="lg"
                className="h-32 flex flex-col items-center justify-center gap-2 text-lg font-semibold"
                variant="outline"
              >
                🏢<span>Business</span>
              </Button>
              <Button
                onClick={() => setCustomerType("Residential")}
                size="lg"
                className="h-32 flex flex-col items-center justify-center gap-2 text-lg font-semibold"
                variant="outline"
              >
                🏠<span>Residential</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-md space-y-6">
        <Button variant="ghost" size="sm" onClick={() => setCustomerType(null)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-foreground">Upload Bill</h2>
          <p className="text-muted-foreground">Photo or PDF of the current telco bill</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleTakePhoto}
            disabled={isProcessing}
            size="lg"
            className="w-full h-20 flex items-center justify-center gap-3 text-lg font-semibold"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Take Photo
              </>
            )}
          </Button>

          <Button
            onClick={handleUploadFile}
            disabled={isProcessing}
            size="lg"
            variant="outline"
            className="w-full h-20 flex items-center justify-center gap-3 text-lg font-semibold bg-transparent"
          >
            <Upload className="w-5 h-5" />
            Upload File
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <p className="text-xs text-muted-foreground text-center">
          Powered by Grok AI vision • Extracts customer data automatically
        </p>
      </div>
    </div>
  )
}
