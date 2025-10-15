import { z } from "zod";

const createEnv = () => {
  const serverSchema = z.object({
    CONVEX_SITE_URL: z.url(),
    CONVEX_DEPLOYMENT: z.string().optional(),
    CLERK_SECRET_KEY: z.string(),
    CLERK_JWT_ISSUER_DOMAIN: z.url(),
    OPENAI_SECRET_KEY: z.string(),
  });
  const serverEnv = serverSchema.parse(process.env);

  const clientSchema = z.object({
    NEXT_PUBLIC_CONVEX_URL: z.url(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string(),
    NEXT_PUBLIC_CLERK_FRONTEND_API_URL: z.url(),
  });

  const clientEnv = clientSchema.parse(process.env);

  return {
    server: serverEnv,
    client: clientEnv,
  };
};

export const env = createEnv();
