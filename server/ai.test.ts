import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const caller = appRouter.createCaller({
  user: undefined,
  req: {} as TrpcContext["req"],
  res: {} as TrpcContext["res"],
});

describe("ai input contracts", () => {
  it("rejects an empty marketing brief before an LLM call", async () => {
    await expect(caller.ai.generateMarketing({ format: "Caption", brief: "short" })).rejects.toThrow();
  });

  it("rejects an empty image inspiration prompt", async () => {
    await expect(caller.ai.generateInspiration({ prompt: "" })).rejects.toThrow();
  });
});
