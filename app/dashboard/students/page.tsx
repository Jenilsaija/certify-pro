"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, MoreHorizontal, Plus, Trash, Upload, Loader2, Users } from "lucide-react"; // Import Users icon
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast component

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // State for dialog visibility
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null); // State to store ID of student to delete
  const [isDeleting, setIsDeleting] = useState(false); // State to indicate deletion in progress

  const { toast } = useToast();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("/api/students");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStudents(data);
      } catch (error: any) {
        console.error("Error fetching students:", error);
        setError("Failed to load students.");
        toast({
            title: "Error",
            description: "Failed to load students.",
            variant: "destructive",
          });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  // Function to open the delete confirmation modal
  const handleDeleteClick = (studentId: string) => {
    setStudentToDeleteId(studentId);
    setIsDeleteDialogOpen(true);
  };

  // Function to perform the actual deletion after confirmation
  const confirmDelete = async () => {
    if (!studentToDeleteId) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/students/${studentToDeleteId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // Remove the deleted student from the local state
      setStudents(students.filter(student => student.id !== studentToDeleteId));
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });

    } catch (error: any) {
      console.error("Error deleting student:", error);
       toast({
          title: "Error",
          description: `Failed to delete student: ${error.message}`,
          variant: "destructive",
        });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false); // Close the dialog
      setStudentToDeleteId(null); // Reset the ID
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
            // Display message and icon when no students are found
            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground text-center">
              <Users className="w-16 h-16 mb-4" />
              <p>No students found.</p>
            </div>
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
                        )) : null}
                      </div>
                    </TableCell>
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
                          <Link href={`/dashboard/students/edit/${student.id}`}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}> {/* Prevent closing dropdown on click */}
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => {
                                e.preventDefault(); // Prevent closing dropdown on click
                                handleDeleteClick(student.id);
                            }}
                          >
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

      {/* Delete Confirmation AlertDialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the student
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} variant="destructive">
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash className="mr-2 h-4 w-4" />
              )}
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
