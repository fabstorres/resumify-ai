import OpenAI from "openai";
import { env } from "./env";
import z from "zod";
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
    console.log("Calling OpenAI API with model: gpt-5-nano");
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant that suggests improvements to resumes based on a job description. Return a JSON object with a 'recommendations' array. Each recommendation must have:\n- 'type': exactly one of 'summary', 'experience', 'education', 'skills', or 'projects'\n- 'current': the current text from the resume\n- 'suggested': your improved suggestion\n- 'status': always 'pending'\n- 'metadata': optional additional info\n\nExample format:\n{\n  \"recommendations\": [\n    {\n      \"type\": \"summary\",\n      \"current\": \"Current summary text\",\n      \"suggested\": \"Improved summary text\",\n      \"status\": \"pending\",\n      \"metadata\": {}\n    }\n  ]\n}",
        },
        {
          role: "user",
          content: `Job Description: ${jobDescription}\n\nResume Data: ${JSON.stringify(
            resume,
            null,
            2
          )}`,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in OpenAI response");
    }

    console.log("Raw OpenAI response content:", content);

    const parsed = JSON.parse(content);
    console.log("Parsed JSON:", JSON.stringify(parsed, null, 2));

    // Transform the response to match our schema
    const transformed = {
      recommendations:
        parsed.recommendations?.map((rec: any) => ({
          type: rec.type?.toLowerCase() || "summary", // Default to summary if type is invalid
          current: rec.current || "",
          suggested: rec.suggested || "",
          metadata: rec.metadata,
          status: rec.status || "pending",
        })) || [],
    };

    console.log("Transformed response:", JSON.stringify(transformed, null, 2));

    const validated = Suggestion.parse(transformed);

    console.log("OpenAI API response received:", validated);
    return ok(validated);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return err(AppError.Misc);
  }
}
