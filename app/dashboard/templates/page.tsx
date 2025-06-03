import Link from "next/link"
import Image from "next/image"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/dashboard-layout"

// Sample template data
const templates = [
  {
    id: "1",
    name: "Professional Certificate",
    thumbnail: "/placeholder.svg?height=200&width=300",
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    name: "Course Completion",
    thumbnail: "/placeholder.svg?height=200&width=300",
    createdAt: "2023-06-22",
  },
  {
    id: "3",
    name: "Workshop Attendance",
    thumbnail: "/placeholder.svg?height=200&width=300",
    createdAt: "2023-07-10",
  },
  {
    id: "4",
    name: "Training Certificate",
    thumbnail: "/placeholder.svg?height=200&width=300",
    createdAt: "2023-08-05",
  },
]

export default function TemplatesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Certificate Templates</h1>
          <Link href="/dashboard/templates/new">
            <Button size="sm" className="h-8 gap-1">
              <Plus className="h-3.5 w-3.5" />
              <span>New Template</span>
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="overflow-hidden">
              <div className="aspect-[3/2] relative">
                <Image
                  src={template.thumbnail || "/placeholder.svg"}
                  alt={template.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Created on {new Date(template.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/templates/${template.id}/edit`}>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
