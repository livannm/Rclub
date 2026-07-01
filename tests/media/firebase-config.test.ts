import { describe, expect, it } from "vitest";
import { getFirebaseStorageConfig, isCloudStorageEnabled } from "@/lib/media/firebase-config";

const FULL_ENV = {
  FIREBASE_API_KEY: "AIzaSyExampleKey123",
  FIREBASE_AUTH_DOMAIN: "rclub-demo.firebaseapp.com",
  FIREBASE_PROJECT_ID: "rclub-demo",
  FIREBASE_STORAGE_BUCKET: "rclub-demo.appspot.com",
  FIREBASE_MESSAGING_SENDER_ID: "1234567890",
  FIREBASE_APP_ID: "1:1234567890:web:abcdef"
};

describe("getFirebaseStorageConfig", () => {
  it("returns null when config is missing", () => {
    expect(getFirebaseStorageConfig({})).toBeNull();
    expect(isCloudStorageEnabled({})).toBe(false);
  });

  it("returns null when only some values are present", () => {
    expect(
      getFirebaseStorageConfig({
        FIREBASE_API_KEY: "AIzaSyExampleKey123",
        FIREBASE_PROJECT_ID: "rclub-demo"
      })
    ).toBeNull();
  });

  it("treats placeholder values as not configured", () => {
    expect(
      getFirebaseStorageConfig({
        FIREBASE_API_KEY: "your_api_key",
        FIREBASE_PROJECT_ID: "your_project_id",
        FIREBASE_STORAGE_BUCKET: "your_project.appspot.com",
        FIREBASE_APP_ID: "your_app_id"
      })
    ).toBeNull();
  });

  it("returns a full config and defaults the auth domain", () => {
    const config = getFirebaseStorageConfig(FULL_ENV);
    expect(config).toEqual({
      apiKey: "AIzaSyExampleKey123",
      authDomain: "rclub-demo.firebaseapp.com",
      projectId: "rclub-demo",
      storageBucket: "rclub-demo.appspot.com",
      messagingSenderId: "1234567890",
      appId: "1:1234567890:web:abcdef"
    });
    expect(isCloudStorageEnabled(FULL_ENV)).toBe(true);
  });

  it("derives auth domain from project id when omitted", () => {
    const config = getFirebaseStorageConfig({
      FIREBASE_API_KEY: "AIzaSyExampleKey123",
      FIREBASE_PROJECT_ID: "rclub-demo",
      FIREBASE_STORAGE_BUCKET: "rclub-demo.appspot.com",
      FIREBASE_APP_ID: "1:1234567890:web:abcdef"
    });
    expect(config?.authDomain).toBe("rclub-demo.firebaseapp.com");
    expect(config?.messagingSenderId).toBeUndefined();
  });
});
