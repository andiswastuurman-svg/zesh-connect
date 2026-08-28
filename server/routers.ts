import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import { z } from "zod";
import { createCampaign, listCreatorProfiles, listLibraryAssets, saveLibraryAsset } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  creators: router({
    list: publicProcedure.query(() => listCreatorProfiles()),
  }),
  campaigns: router({
    create: publicProcedure.input(z.object({ ownerId: z.number().int().positive(), name: z.string().min(2), brief: z.string().min(8), objective: z.string().min(2), status: z.enum(["draft", "active", "review", "completed"]).default("draft") })).mutation(({ input }) => createCampaign(input)),
  }),
  library: router({
    list: publicProcedure.input(z.object({ ownerId: z.number().int().positive() })).query(({ input }) => listLibraryAssets(input.ownerId)),
    save: publicProcedure.input(z.object({ ownerId: z.number().int().positive(), title: z.string().min(2), assetType: z.enum(["copy", "prompt", "code", "image", "brief"]), content: z.string().min(1) })).mutation(({ input }) => saveLibraryAsset(input)),
  }),
  ai: router({
    generateMarketing: publicProcedure
      .input(z.object({ format: z.string(), brief: z.string().min(8).max(1200) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are Zesh AI, a concise Cape Town brand strategist. Return only the requested marketing draft, no preamble. Keep it professional, locally grounded, and ready to paste." },
            { role: "user", content: `Create a ${input.format} for this campaign brief: ${input.brief}` },
          ],
        });
        const content = response.choices?.[0]?.message?.content;
        return { content: typeof content === "string" ? content : "No draft was returned. Try refining the brief." };
      }),
    generateResponse: publicProcedure
      .input(z.object({ creator: z.string(), context: z.string().min(8).max(1000), tone: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "You are Zesh AI. Write a warm, specific, professional influencer collaboration message. Include a clear next step. Return only the message." },
            { role: "user", content: `Creator: ${input.creator}. Tone: ${input.tone}. Campaign context: ${input.context}` },
          ],
        });
        const content = response.choices?.[0]?.message?.content;
        return { content: typeof content === "string" ? content : "Could not draft a response." };
      }),
    generateInspiration: publicProcedure
      .input(z.object({ prompt: z.string().min(3).max(500) }))
      .mutation(async ({ input }) => {
        const result = await generateImage({ prompt: `Campaign visual inspiration for a Cape Town creator brief. ${input.prompt}. Modern editorial art direction, vibrant translucent teal, blue and coral planes, clean composition, no text.` });
        return { url: result.url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
