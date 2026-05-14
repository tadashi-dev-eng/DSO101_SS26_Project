import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type { JwtVariables } from "hono/jwt";

export function getAuthenticatedUserId(c: Context<{ Variables: JwtVariables }>) {
  const payload = c.get("jwtPayload");
  if (!payload || typeof payload.sub !== "string") {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return payload.sub;
}

export function validateRegisterPayload(body: any) {
  const email = body.email?.toString().trim();
  const password = body.password?.toString();
  const name = body.name?.toString().trim();

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  return { email, password, name };
}

export function validateLoginPayload(body: any) {
  const email = body.email?.toString().trim();
  const password = body.password?.toString();

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  return { email, password };
}
