import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { isPrismaSchemaMissingError } from "@/lib/db/is-prisma-schema-error";

describe("isPrismaSchemaMissingError", () => {
  it("returns true for Prisma P2021 (table does not exist)", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Table does not exist", {
      code: "P2021",
      clientVersion: "7.8.0",
      meta: { modelName: "Event" },
    });

    expect(isPrismaSchemaMissingError(error)).toBe(true);
  });

  it("returns false for other Prisma errors", () => {
    const error = new Prisma.PrismaClientKnownRequestError("Record not found", {
      code: "P2025",
      clientVersion: "7.8.0",
    });

    expect(isPrismaSchemaMissingError(error)).toBe(false);
  });

  it("returns false for non-Prisma errors", () => {
    expect(isPrismaSchemaMissingError(new Error("network"))).toBe(false);
    expect(isPrismaSchemaMissingError(null)).toBe(false);
  });
});
