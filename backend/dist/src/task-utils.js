import { HTTPException } from "hono/http-exception";
export function buildTaskUpdateData(body) {
    const title = body.title?.toString().trim();
    const description = body.description !== undefined ? body.description?.toString().trim() : undefined;
    const completed = typeof body.completed === "boolean" ? body.completed : undefined;
    const updateData = {};
    if (title)
        updateData.title = title;
    if (description !== undefined)
        updateData.description = description;
    if (typeof completed === "boolean")
        updateData.completed = completed;
    if (body.dueDate !== undefined) {
        if (body.dueDate === null || body.dueDate === "") {
            updateData.dueDate = null;
        }
        else {
            const dueDateValue = new Date(body.dueDate);
            if (!dueDateValue || Number.isNaN(dueDateValue.getTime())) {
                throw new HTTPException(400, { message: "Invalid dueDate" });
            }
            updateData.dueDate = dueDateValue;
        }
    }
    if (Object.keys(updateData).length === 0) {
        throw new HTTPException(400, { message: "No valid fields to update" });
    }
    return updateData;
}
