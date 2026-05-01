/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { HTTPException } from "hono/http-exception";
import { getAuthenticatedUserId, validateLoginPayload, validateRegisterPayload } from "./auth.js";

describe("auth helpers", () => {
  it("returns the authenticated user id when jwt payload is present", () => {
    const ctx = { get: () => ({ sub: "user-123" }) } as any;
    expect(getAuthenticatedUserId(ctx)).toBe("user-123");
  });

  it("throws Unauthorized when jwt payload is missing", () => {
    const ctx = { get: () => null } as any;
    expect(() => getAuthenticatedUserId(ctx)).toThrow(HTTPException);
  });

  it("validates login payload successfully", () => {
    const payload = validateLoginPayload({ email: " user@example.com ", password: "secret" });
    expect(payload).toEqual({ email: "user@example.com", password: "secret" });
  });

  it("throws when login payload is invalid", () => {
    expect(() => validateLoginPayload({ email: "", password: "" })).toThrow(HTTPException);
  });

  it("validates register payload successfully", () => {
    const payload = validateRegisterPayload({ email: " user@example.com ", password: "secret", name: "Alice" });
    expect(payload).toEqual({ email: "user@example.com", password: "secret", name: "Alice" });
  });

  it("throws when register payload misses email or password", () => {
    expect(() => validateRegisterPayload({ email: "", password: "" })).toThrow(HTTPException);
  });
});
