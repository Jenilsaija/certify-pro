'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast component
import { DashboardLayout } from '@/components/dashboard-layout';

interface StudentData {
  id: number;
  name: string;
  email: string;
  courses: string;
}

export default function EditStudentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student data
  useEffect(() => {
    if (!id) return;

    const fetchStudent = async () => {
      try {
        setLoading(true);
        const studentId = id;
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch student');
        }
        const data = await res.json();
        setStudent(data);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: `Failed to load student data: ${err.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, toast]); // Depend on id and toast

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => {
      if (!prevStudent) return null;
      return {
        ...prevStudent,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!student || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const studentId = id;
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: student.name,
          email: student.email,
          courses: student.courses,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update student');
      } else {
        // Assuming the PUT request returns the updated student data or a success indicator
        // const updatedStudent = await res.json(); // If API returns updated data
        // setStudent(updatedStudent); // Update state if needed
      }

      toast({
        title: "Success",
        description: "Student updated successfully.",
      });

      router.push('/dashboard/students'); // Redirect back to the students list

    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: `Failed to update student: ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">Error: {error}</div>;
  }

  if (!student) {
    return <div className="container mx-auto py-8">Student not found.</div>;
  }


  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Student</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={student.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="courses">Courses (comma-separated)</Label>
            <Textarea
              id="courses"
              name="courses"
              value={student.courses}
              onChange={handleChange}
              rows={4}
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
