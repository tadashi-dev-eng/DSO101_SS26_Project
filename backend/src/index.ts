import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { HTTPException } from "hono/http-exception";
import { jwt, sign } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

type Variables = JwtVariables;

const app = new Hono<{ Variables: Variables }>();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "mySecretKey";

app.use("/*", cors());

app.get("/", (c) => {
  return c.json({ status: "ok", message: "Server running" });
});

app.post("/register", async (c) => {
  const body = await c.req.json();
  const email = body.email?.toString().trim();
  const password = body.password?.toString();
  const name = body.name?.toString().trim();

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return c.json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return c.json({ message: "Email already exists" }, 409);
    }
    throw new HTTPException(500, { message: "Registration failed" });
  }
});

app.post("/login", async (c) => {
  const body = await c.req.json();
  const email = body.email?.toString().trim();
  const password = body.password?.toString();

  if (!email || !password) {
    throw new HTTPException(400, { message: "Email and password are required" });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, hashedPassword: true },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  const passwordMatches = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordMatches) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  const payload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
  };
  const token = await sign(payload, JWT_SECRET);

  return c.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  });
});

app.use(
  "/protected/*",
  jwt({
    secret: JWT_SECRET,
    alg: "HS256",
  })
);

app.get("/protected/me", (c) => {
  const payload = c.get("jwtPayload");
  if (!payload) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }
  return c.json({ userId: payload.sub });
});

const port = Number(process.env.PORT ?? 3001);
console.log(`Server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
