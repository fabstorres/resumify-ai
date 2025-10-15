import { v } from "convex/values";
import { internalAction, mutation, query } from "./_generated/server";
import { AppError, err, ok } from "@/lib/types/common";
import { resumeArgsValidator } from "./resumes";
import generateAISuggestion from "@/lib/openai";
import { api, internal } from "./_generated/api";

// Get the current suggestion for a resume
export const getSuggestion = query({
  args: {
    resumeId: v.id("resumes"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    const suggestion = await ctx.db
      .query("suggestions")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .unique();

    if (!suggestion) return err(AppError.NotFound);

    return ok(suggestion);
  },
});

export const generateSuggestion = mutation({
  args: { resumeId: v.id("resumes"), jobDesc: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    let suggestion = await ctx.db
      .query("suggestions")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .unique();

    if (!suggestion) {
      const suggestionId = await ctx.db.insert("suggestions", {
        resumeId: args.resumeId,
        jobDescription: args.jobDesc,
        updatedAt: Date.now(),
        recommendations: [],
      });
      suggestion = await ctx.db.get(suggestionId);
    }

    // Get the resume data for the AI suggestion
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const resumeForAI = {
      title: resume.title,
      personalInfo: resume.personalInfo,
      summary: resume.summary,
      experience: resume.experience,
      education: (resume.education || []).map((edu: any) => ({
        ...edu,
        gpa: edu.gpa ?? "",
      })),
      skills: resume.skills,
      projects: resume.projects,
    };

    await ctx.scheduler.runAfter(0, internal.suggestions.getAISuggesstion, {
      resumeData: resumeForAI,
      jobDesc: args.jobDesc,
      suggestionId: suggestion!._id,
    });
  },
});

export const getAISuggesstion = internalAction({
  args: {
    resumeData: v.object(resumeArgsValidator),
    jobDesc: v.string(),
    suggestionId: v.id("suggestions"),
  },
  handler: async (ctx, args) => {
    const aiResponse = await generateAISuggestion(
      args.resumeData,
      args.jobDesc
    );

    if (!aiResponse.ok) return;
    // Schedule updateSuggestion to update the suggestion with the AI response
    await ctx.scheduler.runAfter(0, api.suggestions.updateSuggestion, {
      suggestionId: args.suggestionId,
      jobDescription: args.jobDesc,
      recommendations: aiResponse.value!.recommendations,
    });
  },
});

// Create or overwrite the suggestion for a resume
export const createSuggestion = mutation({
  args: {
    resumeId: v.id("resumes"),
    jobDescription: v.string(),
    recommendations: v.array(
      v.object({
        type: v.string(),
        current: v.string(),
        suggested: v.string(),
        metadata: v.optional(v.any()),
        status: v.string(), // "pending" | "accepted" | "rejected"
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    const existing = await ctx.db
      .query("suggestions")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        jobDescription: args.jobDescription,
        recommendations: args.recommendations,
        updatedAt: now,
      });
      return ok(existing._id);
    } else {
      const suggestionId = await ctx.db.insert("suggestions", {
        resumeId: args.resumeId,
        jobDescription: args.jobDescription,
        recommendations: args.recommendations,
        updatedAt: now,
      });
      return ok(suggestionId);
    }
  },
});

// Update an existing suggestion (e.g. accept/reject recommendations)
export const updateSuggestion = mutation({
  args: {
    suggestionId: v.id("suggestions"),
    jobDescription: v.optional(v.string()),
    recommendations: v.optional(
      v.array(
        v.object({
          type: v.string(),
          current: v.string(),
          suggested: v.string(),
          metadata: v.optional(v.any()),
          status: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) return err(AppError.NotFound);

    await ctx.db.patch(args.suggestionId, {
      ...(args.jobDescription ? { jobDescription: args.jobDescription } : {}),
      ...(args.recommendations
        ? { recommendations: args.recommendations }
        : {}),
      updatedAt: Date.now(),
    });

    return ok(true);
  },
});
