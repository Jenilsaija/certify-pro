"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "@/components/dashboard-layout"

interface Placeholder {
  id: string
  name: string
  key: string
  x: number
  y: number
}

export default function EditTemplatePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [templateName, setTemplateName] = useState("Professional Certificate")
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([
    { id: "1", name: "Student Name", key: "student_name", x: 50, y: 40 },
    { id: "2", name: "Course Name", key: "course_name", x: 50, y: 50 },
    { id: "3", name: "Completion Date", key: "completion_date", x: 50, y: 60 },
    { id: "4", name: "Certificate ID", key: "certificate_id", x: 50, y: 70 },
  ])
  const [newPlaceholder, setNewPlaceholder] = useState({
    name: "",
    key: "",
    x: 50,
    y: 50,
  })

  const handleAddPlaceholder = () => {
    if (newPlaceholder.name && newPlaceholder.key) {
      setPlaceholders([
        ...placeholders,
        {
          id: `placeholder-${Date.now()}`,
          ...newPlaceholder,
        },
      ])
      setNewPlaceholder({
        name: "",
        key: "",
        x: 50,
        y: 50,
      })
    }
  }

  const handleRemovePlaceholder = (id: string) => {
    setPlaceholders(placeholders.filter((p) => p.id !== id))
  }

  const handlePlaceholderChange = (id: string, field: keyof Placeholder, value: string | number) => {
    setPlaceholders(placeholders.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      router.push("/dashboard/templates")
    } catch (error) {
      console.error("Template update error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">Configure the placeholders for your certificate template.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Template Preview</CardTitle>
                <CardDescription>This is how your certificate template looks.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-[3/2] overflow-hidden rounded-md border">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Certificate template"
                    fill
                    className="object-cover"
                  />
                  {placeholders.map((placeholder) => (
                    <div
                      key={placeholder.id}
                      className="absolute flex h-8 items-center justify-center rounded bg-primary/20 px-2 text-xs font-medium"
                      style={{
                        left: `${placeholder.x}%`,
                        top: `${placeholder.y}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {`{{${placeholder.key}}}`}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Note: This is a simplified representation. Actual placement may vary.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Template Configuration</CardTitle>
                <CardDescription>Configure your template name and placeholders.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="templateName">Template Name</Label>
                  <Input id="templateName" value={templateName} onChange={(e) => setTemplateName(e.target.value)} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Placeholders</h3>
                  </div>

                  <div className="space-y-4">
                    {placeholders.map((placeholder) => (
                      <div key={placeholder.id} className="flex flex-wrap items-center gap-2 rounded-md border p-3">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`placeholder-name-${placeholder.id}`}>Display Name</Label>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleRemovePlaceholder(placeholder.id)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          </div>
                          <Input
                            id={`placeholder-name-${placeholder.id}`}
                            value={placeholder.name}
                            onChange={(e) => handlePlaceholderChange(placeholder.id, "name", e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Label htmlFor={`placeholder-key-${placeholder.id}`}>Variable Key</Label>
                          <Input
                            id={`placeholder-key-${placeholder.id}`}
                            value={placeholder.key}
                            onChange={(e) => handlePlaceholderChange(placeholder.id, "key", e.target.value)}
                          />
                        </div>
                        <div className="w-1/4 space-y-1">
                          <Label htmlFor={`placeholder-x-${placeholder.id}`}>X (%)</Label>
                          <Input
                            id={`placeholder-x-${placeholder.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={placeholder.x}
                            onChange={(e) =>
                              handlePlaceholderChange(placeholder.id, "x", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                        <div className="w-1/4 space-y-1">
                          <Label htmlFor={`placeholder-y-${placeholder.id}`}>Y (%)</Label>
                          <Input
                            id={`placeholder-y-${placeholder.id}`}
                            type="number"
                            min="0"
                            max="100"
                            value={placeholder.y}
                            onChange={(e) =>
                              handlePlaceholderChange(placeholder.id, "y", Number.parseInt(e.target.value))
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 rounded-md border p-3">
                    <h4 className="text-sm font-medium">Add New Placeholder</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label htmlFor="new-placeholder-name">Display Name</Label>
                        <Input
                          id="new-placeholder-name"
                          placeholder="e.g., Student Name"
                          value={newPlaceholder.name}
                          onChange={(e) => setNewPlaceholder({ ...newPlaceholder, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-placeholder-key">Variable Key</Label>
                        <Input
                          id="new-placeholder-key"
                          placeholder="e.g., student_name"
                          value={newPlaceholder.key}
                          onChange={(e) => setNewPlaceholder({ ...newPlaceholder, key: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-placeholder-x">X Position (%)</Label>
                        <Input
                          id="new-placeholder-x"
                          type="number"
                          min="0"
                          max="100"
                          value={newPlaceholder.x}
                          onChange={(e) => setNewPlaceholder({ ...newPlaceholder, x: Number.parseInt(e.target.value) })}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="new-placeholder-y">Y Position (%)</Label>
                        <Input
                          id="new-placeholder-y"
                          type="number"
                          min="0"
                          max="100"
                          value={newPlaceholder.y}
                          onChange={(e) => setNewPlaceholder({ ...newPlaceholder, y: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-1"
                      onClick={handleAddPlaceholder}
                    >
                      <Plus className="h-3 w-3" />
                      Add Placeholder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/templates")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving
                </>
              ) : (
                "Save Template"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
