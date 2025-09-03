"use server";
import { getAuthToken } from "@/app/auth";
import { api } from "@/convex/_generated/api";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

/**
 * @name createResume
 * @route POST /api/actions/createResume
 * @description Creates a new resume based on the master resume
 * @returns The ID of the new resume
 * @description TODO: Add more verbose error handling, add better logging
 */
export const createResume = async () => {
  const token = await getAuthToken();

  const masterResumeResult = await fetchQuery(
    api.resumes.getMasterResume,
    {},
    { token }
  );
  if (!masterResumeResult.ok) {
    throw new Error("Failed to fetch master resume");
  }

  const masterResume = masterResumeResult.value;

  const resumeResult = await fetchMutation(
    api.resumes.createResume,
    {
      title: "New Resume" + Date.now(),
      personalInfo: masterResume.personalInfo,
      summary: masterResume.summary,
      experience: masterResume.experience,
      education: masterResume.education.map((education) => ({
        ...education,
        gpa: education.gpa || "",
      })),
      skills: masterResume.skills,
      projects: masterResume.projects,
    },
    { token }
  );
  if (!resumeResult.ok) {
    throw new Error("Failed to create resume");
  }

  return redirect(`/builder/${resumeResult.value.toString()}`);
};
