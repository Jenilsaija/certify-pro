"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function UploadStudentsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<{
    success: boolean
    message: string
    count?: number
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadResult(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsLoading(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate success
      setUploadResult({
        success: true,
        message: "Students uploaded successfully!",
        count: 25,
      })
    } catch (error) {
      setUploadResult({
        success: false,
        message: "Failed to upload students. Please check your CSV format.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Upload Students</h1>
          <p className="text-muted-foreground">Upload multiple students at once using a CSV file.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>Select a CSV file containing student information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-md border border-dashed p-8">
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Drag and drop your CSV file here or click to browse</p>
                      <p className="text-xs text-muted-foreground">CSV files only (Max 5MB)</p>
                    </div>
                    <input type="file" className="hidden" accept=".csv" onChange={handleFileChange} id="csvFile" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("csvFile")?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>

                {file && (
                  <div className="rounded-md bg-muted p-3">
                    <p className="text-sm font-medium">Selected file:</p>
                    <p className="text-sm text-muted-foreground">{file.name}</p>
                  </div>
                )}

                {uploadResult && (
                  <Alert className={uploadResult.success ? "bg-green-50" : "bg-red-50"}>
                    <AlertDescription>
                      {uploadResult.message}
                      {uploadResult.count && (
                        <span className="block mt-1">{uploadResult.count} students were added to your database.</span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.push("/dashboard/students")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading || !file}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                      </>
                    ) : (
                      "Upload CSV"
                    )}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CSV Format Requirements</CardTitle>
              <CardDescription>Your CSV file should follow this format.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Required Columns:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • <strong>Name</strong> - Student&apos;s full name
                  </li>
                  <li>
                    • <strong>Email</strong> - Student&apos;s email address
                  </li>
                  <li>
                    • <strong>Course</strong> - Course name (optional)
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Example CSV:</h4>
                <div className="rounded-md bg-muted p-3 text-xs font-mono">
                  Name,Email,Course
                  <br />
                  John Doe,john@example.com,Web Development
                  <br />
                  Jane Smith,jane@example.com,UX Design
                  <br />
                  Mike Johnson,mike@example.com,Data Science
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Notes:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• First row should contain column headers</li>
                  <li>• Email addresses must be unique</li>
                  <li>• Course column is optional</li>
                  <li>• Maximum 1000 students per upload</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
