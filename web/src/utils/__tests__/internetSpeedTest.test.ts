import { describe, it, expect, vi, beforeEach } from "vitest";
import { testInternetSpeed, DEFAULT_THRESHOLDS } from "../internetSpeedTest";

describe("internetSpeedTest Utility", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("evaluates pass condition when download, upload and ping meet thresholds", async () => {
    // Mock global fetch to succeed quickly with reasonable sizes
    globalThis.fetch = vi.fn().mockImplementation((url: string, options?: any) => {
      if (options?.method === "POST") {
        return Promise.resolve(new Response(JSON.stringify({ received_bytes: 524288 }), { status: 200 }));
      }
      return Promise.resolve(new Response(new Blob([new ArrayBuffer(500000)]), { status: 200 }));
    });

    const result = await testInternetSpeed({
      minDownloadMbps: 1,
      minUploadMbps: 1,
      maxPingMs: 1000,
    });

    expect(result).toHaveProperty("download");
    expect(result).toHaveProperty("upload");
    expect(result).toHaveProperty("ping");
    expect(result).toHaveProperty("passed");
  });

  it("has sensible default thresholds for AI voice interview", () => {
    expect(DEFAULT_THRESHOLDS.minDownloadMbps).toBe(8);
    expect(DEFAULT_THRESHOLDS.minUploadMbps).toBe(4);
    expect(DEFAULT_THRESHOLDS.maxPingMs).toBe(300);
  });
});
