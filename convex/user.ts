import { mutation } from "@/convex/_generated/server";
import { AppError, err, ok } from "@/lib/types/common";
import { v } from "convex/values";

export const onboard = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return err(AppError.Unauthenicated);
    const { subject, email } = identity;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", subject))
      .unique();
    if (user) return err(AppError.UserAlreadyExists);

    const userId = await ctx.db.insert("users", {
      clerkId: subject,
      email: email!, // safe because Google OAuth always provides it
      masterResume: undefined,
    });

    const resumeId = await ctx.db.insert("resumes", {
      userId,
      title: "Master Resume",
      personalInfo: args.personalInfo,
      summary: args.summary,
      experience: args.experience,
      education: args.education,
      skills: args.skills,
      projects: args.projects,
      updatedAt: Date.now(),
    });

    await ctx.db.patch(userId, { masterResume: resumeId });

    return ok({});
  },
});
