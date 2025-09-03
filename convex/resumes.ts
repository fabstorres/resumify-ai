import { AppError, err, ok } from "@/lib/types/common";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const personalInfoValidator = v.object({
  name: v.string(),
  email: v.string(),
  phone: v.string(),
  location: v.string(),
  linkedin: v.string(),
  github: v.string(),
});

export const experienceValidator = v.object({
  title: v.string(),
  company: v.string(),
  location: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  description: v.string(),
});

export const educationValidator = v.object({
  degree: v.string(),
  school: v.string(),
  location: v.string(),
  graduationDate: v.string(),
  gpa: v.string(),
});

export const projectValidator = v.object({
  name: v.string(),
  description: v.string(),
  technologies: v.string(),
  link: v.optional(v.string()),
});

export const resumeArgsValidator = {
  title: v.string(),
  personalInfo: personalInfoValidator,
  summary: v.string(),
  experience: v.array(experienceValidator),
  education: v.array(educationValidator),
  skills: v.array(v.string()),
  projects: v.array(projectValidator),
};

export const getMasterResume = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);
    const { subject } = identity;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    if (!user.masterResume) return err(AppError.NotFound);

    const resume = await ctx.db.get(user.masterResume);
    if (!resume) return err(AppError.NotFound);
    return ok(resume);
  },
});

export const getResume = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    // 1. Find the Convex user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    // 2. Fetch the resume
    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    // 3. Compare Convex user._id to resume.userId
    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    return ok(resume);
  },
});

export const getResumes = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    const resumes = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return ok(resumes.filter((resume) => resume._id !== user.masterResume));
  },
});

export const createResume = mutation({
  args: resumeArgsValidator,
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    const resumeId = await ctx.db.insert("resumes", {
      userId: user._id,
      title: args.title,
      personalInfo: args.personalInfo,
      summary: args.summary,
      experience: args.experience,
      education: args.education,
      skills: args.skills,
      projects: args.projects,
      updatedAt: Date.now(),
    });

    return ok(resumeId);
  },
});

export const updateExperience = mutation({
  args: {
    resumeId: v.id("resumes"),
    experience: experienceValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      experience: [...resume.experience, args.experience],
    });
    return ok({});
  },
});

export const updateEducation = mutation({
  args: {
    resumeId: v.id("resumes"),
    education: educationValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      education: [...resume.education, args.education],
    });
    return ok({});
  },
});

export const updateProjects = mutation({
  args: {
    resumeId: v.id("resumes"),
    projects: v.array(projectValidator),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      projects: args.projects,
    });
    return ok({});
  },
});

export const updateSkills = mutation({
  args: {
    resumeId: v.id("resumes"),
    skills: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      skills: args.skills,
    });
    return ok({});
  },
});

export const updateSummary = mutation({
  args: {
    resumeId: v.id("resumes"),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      summary: args.summary,
    });
    return ok({});
  },
});

export const updatePersonalInfo = mutation({
  args: {
    resumeId: v.id("resumes"),
    personalInfo: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.string(),
      location: v.string(),
      linkedin: v.string(),
      github: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      personalInfo: args.personalInfo,
    });
    return ok({});
  },
});

export const updateTitle = mutation({
  args: {
    resumeId: v.id("resumes"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);

    const resume = await ctx.db.get(args.resumeId);
    if (!resume) return err(AppError.NotFound);

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return err(AppError.Unauthenicated);

    if (resume.userId !== user._id) return err(AppError.Unauthorized);

    await ctx.db.patch(args.resumeId, {
      title: args.title,
    });
    return ok({});
  },
});
