import OpenAI from "openai";
import { env } from "./env";
import z from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { AppError, err, ok } from "./types/common";
import { ResumeData } from "./types/resume";

const openai = new OpenAI({
  apiKey: env.server.OPENAI_SECRET_KEY,
});

const Suggestion = z.object({
  recommendations: z.array(
    z.object({
      type: z.enum([
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
      ]),
      current: z.string(),
      suggested: z.string(),
      metadata: z.optional(z.any()),
      status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
    })
  ),
});

export default async function generateAISuggestion(
  resume: Omit<ResumeData, "_id">,
  jobDescription: string
) {
  try {
    const response = await openai.responses.parse({
      model: "gpt-5-nano",
      input: [
        {
          role: "system",
          content:
            "You are an assistant that suggests improvements to resumes based on a job description. Every suggestion status should be pending.",
        },
        {
          role: "user",
          content: JSON.stringify({ jobDescription, resume }),
        },
      ],
      text: {
        format: zodTextFormat(Suggestion, "suggestion"),
      },
    });

    return ok(response.output_parsed);
  } catch {
    return err(AppError.Misc);
  }
}
