"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileTextIcon,
  PlusIcon,
  DownloadIcon,
  TrashIcon,
  EyeIcon,
} from "lucide-react";

// Mock data for resumes
const mockResumes = [
  {
    id: 1,
    title: "Software Engineer Resume",
    status: "active" as const,
    lastModified: "2024-01-15",
    created: "2024-01-10",
    jobsApplied: 12,
  },
  {
    id: 2,
    title: "Frontend Developer Resume",
    status: "draft" as const,
    lastModified: "2024-01-12",
    created: "2024-01-08",
    jobsApplied: 0,
  },
  {
    id: 3,
    title: "Full Stack Developer Resume",
    status: "archived" as const,
    lastModified: "2023-12-20",
    created: "2023-12-15",
    jobsApplied: 8,
  },
  {
    id: 4,
    title: "React Developer Resume",
    status: "active" as const,
    lastModified: "2024-01-14",
    created: "2024-01-05",
    jobsApplied: 5,
  },
];

export default function ResumesPage() {
  const [resumes] = useState(mockResumes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditResume = (resumeId: number) => {
    // Navigate to builder with resume ID
    window.location.href = `/builder?resumeId=${resumeId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <FileTextIcon className="size-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Resumify AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/">Home</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-muted-foreground">
              Manage all your resumes in one place. Click on any resume to edit
              it.
            </p>
          </div>
          <Button size="lg" asChild>
            <a href="/builder">
              <PlusIcon className="size-4 mr-2" />
              New Resume
            </a>
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="px-6 py-4 font-semibold">
                  Resume Title
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold">
                  Last Modified
                </TableHead>
                <TableHead className="px-6 py-4 font-semibold">
                  Jobs Applied
                </TableHead>
                <TableHead className="text-right px-6 py-4 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.map((resume) => (
                <TableRow
                  key={resume.id}
                  className="hover:bg-muted/30 border-b border-border/50"
                >
                  <TableCell className="font-medium px-6 py-4">
                    {resume.title}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge
                      className={getStatusColor(resume.status)}
                      variant="secondary"
                    >
                      {resume.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4">
                    {resume.lastModified}
                  </TableCell>
                  <TableCell className="text-muted-foreground px-6 py-4">
                    {resume.jobsApplied}
                  </TableCell>
                  <TableCell className="text-right px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleEditResume(resume.id)}
                        className="px-3"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 hover:bg-primary/10"
                      >
                        <EyeIcon className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 hover:bg-primary/10"
                      >
                        <DownloadIcon className="size-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-2 hover:bg-red-100 hover:text-red-600"
                      >
                        <TrashIcon className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {resumes.length === 0 && (
          <div className="text-center py-12">
            <FileTextIcon className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No resumes yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first resume to get started with your job search.
            </p>
            <Button size="lg" asChild>
              <a href="/builder">
                <PlusIcon className="size-4 mr-2" />
                Create Your First Resume
              </a>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
