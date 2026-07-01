import { Prisma } from "@prisma/client";

/** Prisma P2021 — table/model missing (schema not pushed to the database). */
export function isPrismaSchemaMissingError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2021"
  );
}
