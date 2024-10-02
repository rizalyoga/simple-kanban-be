import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";
import { verifyToken } from "../utils/jwtUtils";

const prisma = new PrismaClient();

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ status_code: 401, message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    const user = verifyToken(token);

    const todos = await prisma.groupTodo.findMany({
      where: {
        createdBy: user.id,
      },
      select: {
        id: true,
        title: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
        description: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format the response to match the desired output
    const formattedTodos = todos.map((todo) => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      created_by: todo.createdBy.toString(),
      created_at: todo.createdAt.toISOString(),
      updated_at: todo.updatedAt.toISOString(),
    }));

    res.status(200).json({
      status_code: 200,
      message: "Todos fetched successfully",
      data: formattedTodos,
    });
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ status_code: 500, message: "Error fetching todos" });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { group_id } = req.params;

    const todo = await prisma.groupTodo.findUnique({
      where: {
        id: parseInt(group_id),
      },
      select: {
        id: true,
        title: true,
        createdBy: true,
      },
    });

    if (!todo) {
      return res
        .status(404)
        .json({ status_code: 404, message: "Todo not found" });
    }

    res.status(200).json({
      status_code: 200,
      message: "Todo fetched successfully",
      data: todo,
    });
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ status_code: 500, message: "Error fetching todo" });
  }
};

export const createTodoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ status_code: 401, message: "User not authenticated" });
    }

    const newTodoGroup = await prisma.groupTodo.create({
      data: {
        title,
        description,
        createdBy: userId,
      },
    });

    res.status(201).json({
      status_code: 201,
      message: "Todo group created successfully",
      data: {
        id: newTodoGroup.id,
        title: newTodoGroup.title,
        description: newTodoGroup.description,
      },
    });
  } catch (error) {
    console.error("Error creating todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error creating todo group" });
  }
};

export const updateTodoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const { group_id } = req.params;

    if (!group_id) {
      return res
        .status(401)
        .json({ status_code: 401, message: "Group todo not found" });
    }

    const updateTodoGroup = await prisma.groupTodo.update({
      where: {
        id: parseInt(group_id),
      },
      data: {
        title,
        description,
      },
    });

    res.status(200).json({
      status_code: 200,
      message: "Todo group updated successfully",
      data: {
        id: updateTodoGroup.id,
        title: updateTodoGroup.title,
        description: updateTodoGroup.description,
      },
    });
  } catch (error) {
    console.error("Error update todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error update todo group" });
  }
};

export const deleteTodoGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { group_id } = req.params;

    if (!group_id) {
      return res
        .status(401)
        .json({ status_code: 401, message: "Group todo not found" });
    }

    await prisma.groupTodo.delete({
      where: {
        id: parseInt(group_id),
      },
    });

    res.status(200).json({
      status_code: 200,
      message: "Todo group deleted successfully",
    });
  } catch (error) {
    console.error("Error delete todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error delete todo group" });
  }
};
