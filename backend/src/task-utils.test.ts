/// <reference types="vitest" />
import { describe, expect, it } from "vitest";
import { HTTPException } from "hono/http-exception";
import { buildTaskUpdateData } from "./task-utils.js";

describe("buildTaskUpdateData", () => {
  it("builds update data with title, description, completed and dueDate", () => {
    const updateData = buildTaskUpdateData({
      title: "  New task title  ",
      description: "  Description  ",
      completed: true,
      dueDate: "2026-06-01",
    });

    expect(updateData).toEqual({
      title: "New task title",
      description: "Description",
      completed: true,
      dueDate: new Date("2026-06-01"),
    });
  });

  it("allows dueDate to be cleared with null", () => {
    const updateData = buildTaskUpdateData({ title: "Title", dueDate: null });
    expect(updateData).toEqual({ title: "Title", dueDate: null });
  });

  it("throws when dueDate is invalid", () => {
    expect(() => buildTaskUpdateData({ title: "Title", dueDate: "not-a-date" })).toThrow(HTTPException);
  });

  it("throws when no valid fields are provided", () => {
    expect(() => buildTaskUpdateData({})).toThrow(HTTPException);
  });
});
