import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();

export const createNewTasksByGroupId = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { name, progress_percentage } = req.body;
    const { todos_group_id } = req.params;

    if (!todos_group_id) {
      return res
        .status(401)
        .json({ status_code: 401, message: "User not authenticated" });
    }

    const taskGroup = prisma.groupTodo.findUnique({
      where: {
        id: parseInt(todos_group_id),
      },
    });

    if (!taskGroup) {
      return res
        .status(404)
        .json({ status_code: 404, message: "Task group not found" });
    }

    const newTask = await prisma.taskItem.create({
      data: {
        name,
        progressPercentage: progress_percentage,
        groupTodo: {
          connect: {
            id: parseInt(todos_group_id),
          },
        },
      },
      select: {
        id: true,
        name: true,
        done: true,
        groupTodoId: true,
        createdAt: true,
        updatedAt: true,
        progressPercentage: true,
      },
    });

    res.status(201).json({
      status_code: 201,
      message: "Task created successfully",
      data: {
        id: newTask.id,
        name: newTask.name,
        done: newTask.done,
        group_todo_id: newTask.groupTodoId,
        created_at: newTask.createdAt.toISOString(),
        updated_at: newTask.createdAt.toISOString(),
        progress_percentage: newTask.progressPercentage,
      },
    });
  } catch (error) {
    console.error("Error creating todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error creating todo group" });
  }
};

export const getTasksByGroupId = async (req: Request, res: Response) => {
  try {
    const { todos_group_id } = req.params;

    const tasks = await prisma.taskItem.findMany({
      where: {
        groupTodoId: parseInt(todos_group_id),
      },
      select: {
        id: true,
        name: true,
        done: true,
        groupTodoId: true,
        createdAt: true,
        updatedAt: true,
        progressPercentage: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Format the response to match the desired output
    const formattedTasks = tasks.map((task) => ({
      id: task.id,
      name: task.name,
      done: task.done,
      group_todo_id: task.groupTodoId,
      created_at: task.createdAt.toISOString(),
      updated_at: task.updatedAt.toISOString(),
      progress_percentage: task.progressPercentage,
    }));

    res.status(200).json({
      status_code: 200,
      message: "Success",
      data: formattedTasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks" });
  }
};

export const updateTaskItem = async (req: AuthRequest, res: Response) => {
  try {
    const { todos_group_id, task_id } = req.params;
    const { target_todo_id, name, progress_percentage } = req.body;

    if (!todos_group_id || !task_id) {
      return res
        .status(401)
        .json({ status_code: 401, message: "User not authenticated" });
    }

    const updateTaskItem = await prisma.taskItem.update({
      where: {
        id: parseInt(task_id),
      },
      data: {
        name,
        progressPercentage: progress_percentage,
        groupTodo: {
          connect: {
            id: parseInt(target_todo_id),
          },
        },
      },
      select: {
        id: true,
        name: true,
        done: true,
        groupTodoId: true,
        createdAt: true,
        updatedAt: true,
        progressPercentage: true,
      },
    });

    res.status(200).json({
      status_code: 200,
      message: "Task updated successfully",
      data: {
        todo_id: updateTaskItem.groupTodoId,
        id: updateTaskItem.id,
        name: updateTaskItem.name,
        done: updateTaskItem.done,
        created_at: updateTaskItem.createdAt.toISOString(),
        updated_at: updateTaskItem.updatedAt.toISOString(),
        progress_percentage: updateTaskItem.progressPercentage,
      },
    });
  } catch (error) {
    console.error("Error creating todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error update todo group" });
  }
};

export const deleteTaskItem = async (req: AuthRequest, res: Response) => {
  try {
    const { todos_group_id, task_id } = req.params;

    if (!todos_group_id || !task_id) {
      return res
        .status(401)
        .json({ status_code: 401, message: "User not authenticated" });
    }

    await prisma.taskItem.delete({
      where: {
        id: parseInt(task_id),
      },
    });

    res.status(200).json({
      status_code: 200,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error creating todo group:", error);
    res
      .status(500)
      .json({ status_code: 500, message: "Error creating todo group" });
  }
};
