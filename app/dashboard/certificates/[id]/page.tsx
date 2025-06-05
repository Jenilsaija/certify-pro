'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard-layout';
import Link from 'next/link';

interface Certificate {
  id: string;
  certificateId: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateData: string;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
  template: {
    id: string;
    name: string;
  };
}

export default function CertificateDetailPage() {
  const params = useParams();
  const certificateId = params.id as string;
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertificate() {
      if (!certificateId) return;

      try {
        const response = await fetch(`/api/certificates/${certificateId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCertificate(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return <div className="text-center py-8">Loading certificate...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  if (!certificate) {
    return <div className="text-center py-8">Certificate not found.</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Certificate Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Certificate ID:</strong> {certificate.certificateId}</p>
            <p><strong>Course Name:</strong> {certificate.courseName}</p>
            <p><strong>Student Name:</strong> {certificate.student.name}</p>
            <p><strong>Student Email:</strong> {certificate.student.email}</p>
            <p><strong>Completion Date:</strong> {new Date(certificate.completionDate).toLocaleDateString()}</p>
            <p><strong>Instructor:</strong> {certificate.instructorName}</p>
            <p><strong>Template Used:</strong> {certificate.template.name}</p>
            <p><strong>Generated On:</strong> {new Date(certificate.createdAt).toLocaleDateString()}</p>
            {certificate.certificateData && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Certificate Image:</h3>
                <img src={certificate.certificateData} alt="Certificate" className="max-w-full h-auto border rounded-md" />
                <div className="mt-4 flex gap-2">
                  <a href={certificate.certificateData} download={`${certificate.certificateId}.png`}>
                    <Button>Download Certificate</Button>
                  </a>
                  <Link href={`/dashboard/certificates`} passHref>
                    <Button variant="outline">Back to Certificates</Button>
                  </Link>
                </div>
              </div>
            )}
            {!certificate.certificateData && (
              <div className="mt-4">
                <Link href={`/dashboard/certificates`} passHref>
                  <Button variant="outline">Back to Certificates</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}