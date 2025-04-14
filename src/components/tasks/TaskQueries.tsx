import { useMutation, useQuery } from "@tanstack/react-query";
import { QueryKeyConstants } from "../../utils/QueryConstants";
import {
  CreateTaskRequest,
  FetchTaskRequest,
  Task,
  UpdateTaskRequest,
} from "./types";
import {
  createTask,
  deleteTask,
  fetchTasks,
  updateTask,
} from "../../api/taskApi";
import { queryClient } from "../../utils/queryClient";

export const useCreateTaskMutation = () => {
  return useMutation({
    mutationKey: [QueryKeyConstants.Tasks, QueryKeyConstants.CreateTask],
    mutationFn: async (task: CreateTaskRequest) => {
      return await createTask(task);
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyConstants.Tasks],
      });
    },
  });
};

export const useUpdateTaskMutation = () => {
  return useMutation({
    mutationKey: [QueryKeyConstants.Tasks, QueryKeyConstants.UpdateTask],
    mutationFn: async (task: UpdateTaskRequest) => {
      return await updateTask(task);
    },
    onMutate: async (newTask: UpdateTaskRequest) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeyConstants.Tasks] });
      const previousTasks = queryClient.getQueriesData<{
        tasks: Task[];
        totalCount: number;
        hasMoreItems: boolean;
      }>({ queryKey: [QueryKeyConstants.Tasks] });
      const previousTask = previousTasks?.[0]?.[1]?.tasks.find(
        (task) => task.id === newTask.id
      );
      return previousTask;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyConstants.Tasks],
      });
    },
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation({
    mutationKey: [QueryKeyConstants.Tasks, QueryKeyConstants.UpdateTask],
    mutationFn: async (taskId: string) => {
      await deleteTask(taskId);
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: [QueryKeyConstants.Tasks] });
      const previousTasks = queryClient.getQueriesData<{
        tasks: Task[];
        totalCount: number;
        hasMoreItems: boolean;
      }>({ queryKey: [QueryKeyConstants.Tasks] });
      const previousTask = previousTasks?.[0]?.[1]?.tasks.find(
        (task) => task.id === taskId
      );
      return previousTask;
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeyConstants.Tasks],
      });
    },
  });
};

export const useFetchTaskQuery = (req?: FetchTaskRequest) => {
  return useQuery({
    queryKey: [QueryKeyConstants.Tasks, QueryKeyConstants.UpdateTask, req],
    queryFn: async ({ signal }: { signal?: AbortSignal }) => {
      if (req === undefined) {
        throw new Error("Request is undefined");
      } else {
        return await fetchTasks(req, { signal });
      }
    },
  });
};
