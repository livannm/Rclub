import { describe, expect, it } from "vitest";
import { createMediaStorage } from "@/lib/media/media-storage-instance";

describe("createMediaStorage", () => {
  it("falls back to local storage when Firebase is not configured", () => {
    const storage = createMediaStorage(null);
    expect(storage.provider).toBe("local");
  });

  it("uses Firebase storage when a config is provided", () => {
    const storage = createMediaStorage({
      apiKey: "AIzaSyExampleKey123",
      authDomain: "rclub-demo.firebaseapp.com",
      projectId: "rclub-demo",
      storageBucket: "rclub-demo.appspot.com",
      appId: "1:1234567890:web:abcdef"
    });
    expect(storage.provider).toBe("firebase");
  });
});
