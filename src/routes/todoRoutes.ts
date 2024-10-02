import express from "express";
import {
  getAllTodos,
  getTodoById,
  createTodoGroup,
  updateTodoGroup,
  deleteTodoGroup,
} from "../controllers/todosController";
import {
  createNewTasksByGroupId,
  getTasksByGroupId,
  updateTaskItem,
  deleteTaskItem,
} from "../controllers/taskController";
import { authenticateJWT } from "../middleware/authMiddleware";
import { validateCreateTodoGroup } from "../middleware/validation";

const router = express.Router();

router.get("/", authenticateJWT, getAllTodos);
router.get("/:group_id", authenticateJWT, getTodoById);
router.post("/", authenticateJWT, validateCreateTodoGroup, createTodoGroup);
router.patch(
  "/:group_id",
  authenticateJWT,
  validateCreateTodoGroup,
  updateTodoGroup
);
router.delete("/:group_id", authenticateJWT, deleteTodoGroup);

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
