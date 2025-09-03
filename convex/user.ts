import { mutation } from "@/convex/_generated/server";
import { AppError, err, ok } from "@/lib/types/common";
import { resumeArgsValidator } from "./resumes";

export const onboard = mutation({
  args: resumeArgsValidator,
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
