// app/api/exporter/resume/[resumeId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { pdf, renderToStream } from "@react-pdf/renderer";
import { PDFTemplate } from "@/components/resume/pdf-template";
import { ResumeData } from "@/lib/types/resume";

const resume: ResumeData = {
  personalInfo: {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-123-4567",
    location: "San Francisco, CA",
    linkedin: "https://linkedin.com/in/janedoe",
    github: "https://github.com/janedoe",
  },
  summary:
    "Full-stack developer with 5+ years of experience building scalable web applications.",
  experience: [
    {
      id: "1",
      title: "Software Engineer",
      company: "TechCorp",
      location: "Remote",
      startDate: "Jan 2020",
      endDate: "Present",
      description:
        "Built and maintained full-stack applications using React, Node.js, and AWS.",
    },
  ],
  education: [
    {
      id: "2",
      degree: "B.S. Computer Science",
      school: "State University",
      location: "CA",
      graduationDate: "2019",
      gpa: "3.8",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "TypeScript", "AWS"],
  projects: [
    {
      id: "1",
      name: "Portfolio Website",
      description: "Personal portfolio showcasing projects and blog posts.",
      technologies: "Next.js, TailwindCSS, Vercel",
      link: "https://janedoe.dev",
    },
  ],
};

export async function GET(
  _: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  const { resumeId } = await params;

  //const buffer = await pdf(<PDFTemplate resume={resume} />).toBuffer();

  const stream = await renderToStream(<PDFTemplate resume={resume} />);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
    },
  });
}
