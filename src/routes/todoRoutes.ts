import express from "express";
import {
  getAllTodos,
  createTodoGroup,
  getTasksByGroupId,
  createNewTasksByGroupId,
  updateTaskItem,
  deleteTaskItem,
} from "../controllers/todosController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { validateCreateTodoGroup } from "../middleware/validation";

const router = express.Router();

router.get("/", authenticateJWT, getAllTodos);
router.post("/", authenticateJWT, validateCreateTodoGroup, createTodoGroup);

// Tasks by group
router.get("/:todos_group_id/items", authenticateJWT, getTasksByGroupId);
router.post("/:todos_group_id/items", authenticateJWT, createNewTasksByGroupId);
router.patch(
  "/:todos_group_id/items/:task_id",
  authenticateJWT,
  updateTaskItem
);
router.delete(
  "/:todos_group_id/items/:task_id",
  authenticateJWT,
  deleteTaskItem
);

export default router;
