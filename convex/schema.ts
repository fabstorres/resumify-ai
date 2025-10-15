import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    masterResume: v.optional(v.id("resumes")),
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),
  resumes: defineTable({
    userId: v.id("users"),
    title: v.string(),

    personalInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedin: v.string(),
      github: v.string(),
    }),

    summary: v.string(),

    experience: v.array(
      v.object({
        title: v.string(),
        company: v.string(),
        location: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        description: v.string(),
      })
    ),

    education: v.array(
      v.object({
        degree: v.string(),
        school: v.string(),
        location: v.string(),
        graduationDate: v.string(),
        gpa: v.optional(v.string()),
      })
    ),

    skills: v.array(v.string()),

    projects: v.array(
      v.object({
        name: v.string(),
        description: v.string(),
        technologies: v.string(),
        link: v.optional(v.string()),
      })
    ),

    updatedAt: v.number(),
  }).index("by_user", ["userId"]),
  suggestions: defineTable({
    resumeId: v.id("resumes"),

    jobDescription: v.string(), // the latest job description used

    updatedAt: v.number(),

    recommendations: v.array(
      v.object({
        type: v.string(), // "summary" | "experience" | "education" | "skills" | "projects"
        current: v.string(),
        suggested: v.string(),
        metadata: v.optional(v.any()), // flexible extra info (company, dates, etc.)
        status: v.string(), // "pending" | "accepted" | "rejected"
      })
    ),
  }).index("by_resume", ["resumeId"]),
});
