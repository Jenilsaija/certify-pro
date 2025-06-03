"use client"

import { useState } from "react"
import { CalendarIcon, CheckCircle, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DashboardLayout } from "@/components/dashboard-layout"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Student {
  id: string
  name: string
  email: string
}

interface Template {
  id: string
  name: string
}

const templates: Template[] = [
  { id: "1", name: "Professional Certificate" },
  { id: "2", name: "Course Completion" },
  { id: "3", name: "Workshop Attendance" },
]

const students: Student[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com" },
  { id: "3", name: "Mike Johnson", email: "mike.johnson@example.com" },
  { id: "4", name: "Sarah Wilson", email: "sarah.wilson@example.com" },
]

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [courseName, setCourseName] = useState("")
  const [completionDate, setCompletionDate] = useState<Date>()
  const [instructorName, setInstructorName] = useState("")

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  const handleGenerate = async () => {
    setIsLoading(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 3000))
      setIsComplete(true)
    } catch (error) {
      console.error("Certificate generation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedToStep2 = selectedTemplate !== ""
  const canProceedToStep3 = selectedStudents.length > 0
  const canGenerate = courseName && completionDate && instructorName

  if (isComplete) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[400px] items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Certificates Generated!</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                {selectedStudents.length} certificates have been generated and are being sent to students.
              </p>
              <Button onClick={() => window.location.reload()}>Generate More Certificates</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Generate Certificates</h1>
          <p className="text-muted-foreground">Follow the steps below to generate certificates for your students.</p>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                  currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {step}
              </div>
              {step < 4 && <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Template */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Template</CardTitle>
              <CardDescription>Choose the certificate template you want to use.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} disabled={!canProceedToStep2}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Students */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Select Students</CardTitle>
              <CardDescription>Choose which students should receive certificates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={student.id}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => handleStudentToggle(student.id)}
                    />
                    <Label htmlFor={student.id} className="flex-1 cursor-pointer">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(3)} disabled={!canProceedToStep3}>
                  Next ({selectedStudents.length} selected)
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Course Details */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Course Details</CardTitle>
              <CardDescription>Enter the course information for the certificates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name</Label>
                <Input
                  id="courseName"
                  placeholder="e.g., Web Development Masterclass"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Completion Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !completionDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {completionDate ? format(completionDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={completionDate} onSelect={setCompletionDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorName">Instructor Name</Label>
                <Input
                  id="instructorName"
                  placeholder="e.g., Dr. Jane Smith"
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                />
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep(4)} disabled={!canGenerate}>
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Preview & Generate */}
        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Preview & Generate</CardTitle>
              <CardDescription>Review your selections and generate the certificates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Template</h4>
                  <p className="text-sm text-muted-foreground">
                    {templates.find((t) => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium">Students ({selectedStudents.length})</h4>
                  <div className="text-sm text-muted-foreground">
                    {students
                      .filter((s) => selectedStudents.includes(s.id))
                      .map((s) => s.name)
                      .join(", ")}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium">Course Details</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Course: {courseName}</p>
                    <p>Date: {completionDate ? format(completionDate, "PPP") : ""}</p>
                    <p>Instructor: {instructorName}</p>
                  </div>
                </div>
              </div>

              {isLoading && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription>Generating certificates... This may take a few moments.</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(3)} disabled={isLoading}>
                  Back
                </Button>
                <Button onClick={handleGenerate} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Certificates"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
