import { beforeEach, describe, expect, it } from "vitest";
import {
  FormProtectionError,
  assertFormSubmissionAllowed,
  resetFormProtectionForTests
} from "@/lib/anti-spam/form-protection";

describe("form anti-spam protection", () => {
  beforeEach(() => {
    resetFormProtectionForTests();
  });

  it("blocks submissions when the honeypot field is filled", () => {
    expect(() =>
      assertFormSubmissionAllowed({
        formName: "reservation",
        identifier: "127.0.0.1",
        honeypot: "https://spam.example"
      })
    ).toThrow(FormProtectionError);
  });

  it("rate-limits repeated submissions per form and identifier", () => {
    const submission = {
      formName: "reservation",
      identifier: "127.0.0.1",
      maxAttempts: 2,
      windowMs: 60_000,
      now: 1_000
    };

    assertFormSubmissionAllowed(submission);
    assertFormSubmissionAllowed(submission);

    expect(() => assertFormSubmissionAllowed(submission)).toThrow(FormProtectionError);
  });

  it("allows submissions again after the rate-limit window expires", () => {
    const submission = {
      formName: "privatisation",
      identifier: "127.0.0.1",
      maxAttempts: 1,
      windowMs: 60_000,
      now: 1_000
    };

    assertFormSubmissionAllowed(submission);
    expect(() => assertFormSubmissionAllowed(submission)).toThrow(FormProtectionError);

    assertFormSubmissionAllowed({ ...submission, now: 61_001 });
  });
});
