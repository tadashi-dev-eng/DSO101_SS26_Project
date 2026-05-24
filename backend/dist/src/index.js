import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { PrismaClient, Prisma } from "../generated/prisma/client.js";
import { HTTPException } from "hono/http-exception";
import { jwt, sign } from "hono/jwt";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { getAuthenticatedUserId, validateLoginPayload, validateRegisterPayload } from "./auth.js";
import { buildTaskUpdateData } from "./task-utils.js";
dotenv.config();
const app = new Hono();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET ?? "mySecretKey";
app.use("/*", cors());
app.get("/", (c) => {
    return c.json({ status: "ok", message: "Server running" });
});
app.post("/register", async (c) => {
    const body = await c.req.json();
    const { email, password, name } = validateRegisterPayload(body);
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
    }
    catch (error) {
        console.error("Register error:", error);
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return c.json({ message: "Email already exists" }, 409);
        }
        throw new HTTPException(500, { message: "Registration failed" });
    }
});
app.post("/login", async (c) => {
    const body = await c.req.json();
    const { email, password } = validateLoginPayload(body);
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
app.use("/protected/*", jwt({
    secret: JWT_SECRET,
    alg: "HS256",
}));
app.get("/protected/me", (c) => {
    const userId = getAuthenticatedUserId(c);
    return c.json({ userId });
});
app.get("/protected/tasks", async (c) => {
    const userId = getAuthenticatedUserId(c);
    const tasks = await prisma.task.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
    });
    return c.json({ tasks });
});
app.get("/protected/tasks/:id", async (c) => {
    const userId = getAuthenticatedUserId(c);
    const id = c.req.param("id");
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.authorId !== userId) {
        throw new HTTPException(404, { message: "Task not found" });
    }
    return c.json({ task });
});
app.post("/protected/tasks", async (c) => {
    const userId = getAuthenticatedUserId(c);
    const body = await c.req.json();
    const title = body.title?.toString().trim();
    const description = body.description?.toString().trim();
    const completed = body.completed === true;
    const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
    if (!title) {
        throw new HTTPException(400, { message: "Task title is required" });
    }
    if (dueDate && Number.isNaN(dueDate.getTime())) {
        throw new HTTPException(400, { message: "Invalid dueDate" });
    }
    const task = await prisma.task.create({
        data: {
            title,
            description,
            completed,
            dueDate,
            authorId: userId,
        },
    });
    return c.json({ message: "Task created successfully", task }, 201);
});
app.put("/protected/tasks/:id", async (c) => {
    const userId = getAuthenticatedUserId(c);
    const id = c.req.param("id");
    const body = await c.req.json();
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.authorId !== userId) {
        throw new HTTPException(404, { message: "Task not found" });
    }
    const updateData = buildTaskUpdateData(body);
    const updatedTask = await prisma.task.update({
        where: { id },
        data: updateData,
    });
    return c.json({ message: "Task updated successfully", task: updatedTask });
});
app.delete("/protected/tasks/:id", async (c) => {
    const userId = getAuthenticatedUserId(c);
    const id = c.req.param("id");
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || task.authorId !== userId) {
        throw new HTTPException(404, { message: "Task not found" });
    }
    await prisma.task.delete({ where: { id } });
    return c.json({ message: "Task deleted successfully" });
});
const port = Number(process.env.PORT ?? 3001);
console.log(`Server is running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
