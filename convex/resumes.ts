import { AppError, err, ok } from "@/lib/types/common";
import { query } from "./_generated/server";
import { v } from "convex/values";

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
