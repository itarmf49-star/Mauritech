import type { Prisma } from "@prisma/client";
import { z } from "zod";

function isInputJsonValue(value: unknown): value is Prisma.InputJsonValue {
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
      return true;
    case "object": {
      if (value === null) return false;
      if (Array.isArray(value)) return value.every(isInputJsonValue);
      return Object.values(value).every((entry) => entry === null || isInputJsonValue(entry));
    }
    default:
      return false;
  }
}

/** Validates JSON payloads for Prisma `Json` / `InputJsonValue` columns. */
export const inputJsonSchema = z.custom<Prisma.InputJsonValue>(isInputJsonValue);

export const optionalInputJsonSchema = inputJsonSchema.optional();
