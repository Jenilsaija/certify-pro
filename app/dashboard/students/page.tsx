"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, MoreHorizontal, Plus, Trash, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/dashboard-layout";

interface Student {
  id: string;
  name: string;
  email: string;
  courses: string[]; // Assuming courses is an array of strings
  addedAt: string; // Assuming addedAt is a date string
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students"); // Assuming your API endpoint is /api/students
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Assuming the API returns an array of student objects with the correct structure
        setStudents(data);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        setError("Failed to load students.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle student deletion (placeholder)
  const handleDelete = async (studentId: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      // Implement API call to delete student
      console.log("Deleting student with ID:", studentId);
      // try {
      //   const response = await fetch(`/api/students/${studentId}`, {
      //     method: 'DELETE',
      //   });
      //   if (!response.ok) {
      //     throw new Error(`HTTP error! status: ${response.status}`);
      //   }
      //   // Remove the deleted student from the local state
      //   setStudents(students.filter(student => student.id !== studentId));
      //   console.log("Student deleted successfully");
      // } catch (error) {
      //   console.error("Error deleting student:", error);
      //   alert("Failed to delete student.");
      // }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <h1 className="text-2xl font-bold tracking-tight">Students</h1>
          <div className="flex gap-2">
            <Link href="/dashboard/students/upload">
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload CSV</span>
              </Button>
            </Link>
            <Link href="/dashboard/students/new">
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-3.5 w-3.5" />
                <span>Add Student</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="rounded-md border">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading students...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-8 text-red-500">{error}</div>
          ) : students.length === 0 ? (
            <div className="flex justify-center items-center p-8">No students found.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {/* Check if courses is an array before mapping */}
                        {Array.isArray(student.courses) ? student.courses.map((course, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium"
                          >
                            {course}
                          </span>
                        )) : null} {/* Render nothing if courses is not an array */}
                      </div>
                    </TableCell>
                    {/* Add a check for student.addedAt before calling toLocaleDateString */}
                    <TableCell>{student.addedAt ? new Date(student.addedAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <Link href={`/dashboard/students/${student.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(student.id)}>
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
