// app/api/exporter/resume/[resumeId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { PDFTemplate } from "@/components/resume/pdf-template";

import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

import { Id } from "@/convex/_generated/dataModel";
import { getAuthToken } from "@/app/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ resumeId: string }> }
) {
  const { resumeId } = await params;
  const token = await getAuthToken();

  // Fix: resumeId must be of type Id<"resumes">, not string
  const resumeResults = await fetchQuery(
    api.resumes.getResume,
    {
      resumeId: resumeId as Id<"resumes">,
    },
    { token }
  );

  if (!resumeResults.ok) {
    console.error(resumeResults.error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch resume" }),
      { status: 500 }
    );
  }

  // Use the fetched resume data if available, otherwise fallback to the mock
  const resumeData = resumeResults.value;

  const stream = await renderToStream(<PDFTemplate resume={resumeData} />);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume-${resumeData.title}.pdf"`,
    },
  });
}
