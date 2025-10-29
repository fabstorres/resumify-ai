import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
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

    // Return null instead of error when no suggestion is found
    // This allows the frontend to handle the loading state properly
    if (!suggestion) return null;

    return ok(suggestion);
  },
});

export const generateSuggestion = mutation({
  args: { resumeId: v.id("resumes"), jobDesc: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);
    console.log("AUTHENTICATED");
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);
    console.log("USER FOUND");
    let suggestion = await ctx.db
      .query("suggestions")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .unique();

    if (!suggestion) {
      console.log("NO SUGGESTION FOUND");
      const suggestionId = await ctx.db.insert("suggestions", {
        resumeId: args.resumeId,
        jobDescription: args.jobDesc,
        updatedAt: Date.now(),
        recommendations: [],
      });
      suggestion = await ctx.db.get(suggestionId);
    }
    console.log("SUGGESTION FOUND");
    // Get the resume data for the AI suggestion
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);
    console.log("RESUME FOUND");
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
    console.log("RESUME FOR AI FOUND");
    await ctx.scheduler.runAfter(0, internal.suggestions.getAISuggesstion, {
      resumeData: resumeForAI,
      jobDesc: args.jobDesc,
      suggestionId: suggestion!._id,
    });

    // Return success to indicate the mutation completed and AI processing started
    return ok({
      message: "AI suggestion generation started",
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
    console.log(
      "Starting AI suggestion generation for suggestionId:",
      args.suggestionId
    );

    try {
      const aiResponse = await generateAISuggestion(
        args.resumeData,
        args.jobDesc
      );

      if (!aiResponse.ok) {
        console.error("AI suggestion generation failed:", aiResponse.error);
        return;
      }

      console.log(
        "AI suggestion generation successful, updating suggestion with",
        aiResponse.value!.recommendations.length,
        "recommendations"
      );

      // Schedule internalUpdateSuggestion to update the suggestion with the AI response
      await ctx.scheduler.runAfter(
        0,
        internal.suggestions.internalUpdateSuggestion,
        {
          suggestionId: args.suggestionId,
          jobDescription: args.jobDesc,
          recommendations: aiResponse.value!.recommendations,
        }
      );

      console.log(
        "Scheduled updateSuggestion for suggestionId:",
        args.suggestionId
      );
    } catch (error) {
      console.error("Error in AI suggestion generation:", error);
    }
  },
});

// Internal mutation to update suggestions (no auth required)
export const internalUpdateSuggestion = internalMutation({
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
    console.log(
      "internalUpdateSuggestion called with suggestionId:",
      args.suggestionId
    );
    console.log(
      "internalUpdateSuggestion args:",
      JSON.stringify(args, null, 2)
    );

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      console.log("Suggestion not found in database:", args.suggestionId);
      return;
    }

    console.log("Found suggestion:", JSON.stringify(suggestion, null, 2));
    console.log(
      "Updating suggestion with",
      args.recommendations?.length || 0,
      "recommendations"
    );

    const updateData = {
      ...(args.jobDescription ? { jobDescription: args.jobDescription } : {}),
      ...(args.recommendations
        ? { recommendations: args.recommendations }
        : {}),
      updatedAt: Date.now(),
    };

    console.log("Update data:", JSON.stringify(updateData, null, 2));

    await ctx.db.patch(args.suggestionId, updateData);

    // Verify the update
    const updatedSuggestion = await ctx.db.get(args.suggestionId);
    console.log(
      "Updated suggestion:",
      JSON.stringify(updatedSuggestion, null, 2)
    );

    console.log("Successfully updated suggestion:", args.suggestionId);
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
    console.log(
      "updateSuggestion called with suggestionId:",
      args.suggestionId
    );
    console.log("updateSuggestion args:", JSON.stringify(args, null, 2));

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("No identity found in updateSuggestion");
      return err(AppError.Unauthenicated);
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      console.log("No user found in updateSuggestion");
      return err(AppError.Unauthenicated);
    }

    const suggestion = await ctx.db.get(args.suggestionId);
    if (!suggestion) {
      console.log("Suggestion not found in database:", args.suggestionId);
      return err(AppError.NotFound);
    }

    console.log("Found suggestion:", JSON.stringify(suggestion, null, 2));
    console.log(
      "Updating suggestion with",
      args.recommendations?.length || 0,
      "recommendations"
    );

    const updateData = {
      ...(args.jobDescription ? { jobDescription: args.jobDescription } : {}),
      ...(args.recommendations
        ? { recommendations: args.recommendations }
        : {}),
      updatedAt: Date.now(),
    };

    console.log("Update data:", JSON.stringify(updateData, null, 2));

    await ctx.db.patch(args.suggestionId, updateData);

    // Verify the update
    const updatedSuggestion = await ctx.db.get(args.suggestionId);
    console.log(
      "Updated suggestion:",
      JSON.stringify(updatedSuggestion, null, 2)
    );

    console.log("Successfully updated suggestion:", args.suggestionId);
    return ok(true);
  },
});
