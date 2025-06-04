"use client";
import Link from "next/link"
import Image from "next/image"
import { Edit, MoreHorizontal, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useEffect, useState } from 'react';

interface Template {
  id: string;
  name: string;
  thumbnail: string | null;
  createdAt: string | null;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const response = await fetch("/api/templates");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Template[] = await response.json();
        setTemplates(data);
      } catch (error: any) {
        console.error("Error fetching templates:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  if (loading) {
    return <DashboardLayout><div className="text-center">Loading templates...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout><div className="text-center text-red-600">Error loading templates: {error}</div></DashboardLayout>;
  }

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
          {templates.length === 0 ? (
            <div className="col-span-full text-center">No templates found.</div>
          ) : (
            templates.map((template) => (
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
                        Created on {template.createdAt ? new Date(template.createdAt).toLocaleDateString() : 'N/A'}
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
                        {/* Add a delete action if needed */}
                        {/* <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
