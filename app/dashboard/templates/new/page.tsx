"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function NewTemplatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/dashboard/templates")
    } catch (error) {
      console.error("Template upload error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload New Template</h1>
          <p className="text-muted-foreground">Upload a new certificate template in PDF, PNG, or JPG format.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
              <CardDescription>Provide a name and upload your certificate template file.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="templateName">Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Professional Certificate"
                  required
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="templateFile">Template File</Label>
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                      <p className="text-xs text-muted-foreground">Supports PDF, PNG, JPG (Max 10MB)</p>
                    </div>
                    <Input
                      id="templateFile"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg"
                      required
                      onChange={handleFileChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("templateFile")?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
                {previewUrl && (
                  <div className="mt-4">
                    <p className="mb-2 text-sm font-medium">Preview:</p>
                    <div className="aspect-[3/2] max-h-[300px] overflow-hidden rounded-md border">
                      {file?.type === "application/pdf" ? (
                        <div className="flex h-full items-center justify-center bg-muted p-4">
                          <p className="text-sm">PDF Preview: {file.name}</p>
                        </div>
                      ) : (
                        <img
                          src={previewUrl || "/placeholder.svg"}
                          alt="Template preview"
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/templates")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !file}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                </>
              ) : (
                "Upload Template"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
