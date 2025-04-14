import {
  CreateTaskRequest,
  FetchTaskRequest,
  Task,
  UpdateTaskRequest,
} from "../components/tasks/types";
import { baseAuthenticatedFetch } from "./api";

const baseRoute = "tasks";

export const createTask = async (req: CreateTaskRequest): Promise<Task> => {
  const response = await baseAuthenticatedFetch(`${baseRoute}/create`, {
    method: "POST",
    body: JSON.stringify({ ...req }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Creating task failed");
  }
  const data = await response.json();
  return data.createdTask;
};

export const fetchTasks = async (
  req: FetchTaskRequest,
  init?: RequestInit
): Promise<{ tasks: Task[]; totalCount: number; hasMoreItems: boolean }> => {
  const response = await baseAuthenticatedFetch(`${baseRoute}/`, {
    method: "POST",
    body: JSON.stringify({ ...req }),
    ...init,
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Fetching Task failed");
  }
  const data = await response.json();
  return data;
};

export const updateTask = async (req: UpdateTaskRequest): Promise<Task> => {
  const response = await baseAuthenticatedFetch(`${baseRoute}/update`, {
    method: "PUT",
    body: JSON.stringify({ ...req }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Update Task failed");
  }
  const data = await response.json();
  return data.task;
};

export const deleteTask = async (taskId: string) => {
  const response = await baseAuthenticatedFetch(`${baseRoute}/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Delete Task failed");
  }
};
