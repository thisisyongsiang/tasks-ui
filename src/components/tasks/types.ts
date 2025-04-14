export const allStatus = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "DELETED",
] as const;

export const allStatusWithoutDeleted = allStatus.filter(
  (status) => status !== "DELETED"
);

export type Status = (typeof allStatus)[number];

export type Task = {
  id?: string;
  title: string;
  description: string;
  status: Status;
  priority: number;
  dueDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  userId: string;
  sharedWith?: string[];
};

export type CreateTaskRequest = Omit<
  Task,
  "id" | "createdAt" | "updatedAt" | "userId"
>;
// Partial type for update task request because we may not want to update all fields`
export type UpdateTaskRequest = Partial<
  Omit<Task, "createdAt" | "updatedAt" | "userId">
>;

export const AllTaskSortableFields = [
  "createdAt",
  "dueDate",
  "priority",
] as const;

export const AllSortDirections = ["asc", "desc"] as const;
export type SortDirection = (typeof AllSortDirections)[number];

export type TaskSortableFields = (typeof AllTaskSortableFields)[number];

export type FetchTaskRequest = {
  pageNumber: number;
  pageSize: number;
  status?: Status;
  priority?: number;
  dueDateStart?: Date;
  dueDateEnd?: Date;
  orderBy?: TaskSortableFields;
  order?: SortDirection;
};
