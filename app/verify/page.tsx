"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Award, CheckCircle, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface VerificationResult {
  isValid: boolean
  studentName?: string
  courseName?: string
  issueDate?: string
}

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [certificateId, setCertificateId] = useState("")
  const [result, setResult] = useState<VerificationResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Call the verify API
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ certificateId }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify certificate')
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Verification error:", error)
      setResult({
        isValid: false,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2">
        <Award className="h-8 w-8" />
        <span className="text-2xl font-bold">CertifyPro</span>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Verify Certificate</CardTitle>
          <CardDescription>Enter the certificate ID to verify its authenticity</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificateId">Certificate ID</Label>
              <Input
                id="certificateId"
                placeholder="e.g., CERT123456"
                required
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
              />
            </div>
            {result && (
              <div className={`rounded-lg p-4 ${result.isValid ? "bg-green-50" : "bg-red-50"}`}>
                {result.isValid ? (
                  <div className="flex flex-col items-center space-y-2">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <h3 className="text-lg font-medium text-green-800">Valid Certificate</h3>
                    <div className="w-full space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Student:</span>
                        <span>{result.studentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Course:</span>
                        <span>{result.courseName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Issue Date:</span>
                        <span>{result.issueDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    <XCircle className="h-8 w-8 text-red-500" />
                    <h3 className="text-lg font-medium text-red-800">Invalid Certificate</h3>
                    <p className="text-center text-sm text-red-600">
                      The certificate ID you entered is not valid or could not be found in our system.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
                </>
              ) : (
                "Verify Certificate"
              )}
            </Button>
            <div className="mt-4 text-center text-sm">
              <Link href="/" className="text-primary hover:underline">
                Return to home
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
