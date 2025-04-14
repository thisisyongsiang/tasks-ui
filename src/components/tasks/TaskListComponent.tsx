import React from "react";

import { Flex, ScrollArea } from "@radix-ui/themes";

import { Task } from "./types";
import { TaskCard } from "./TaskCard";

interface Props {
  tasks: Task[];
  handleDelete: (taskId: string) => void;
  handleEdit: (task: Task) => void;
}
export const TaskListComponent = ({
  tasks,
  handleEdit,
  handleDelete,
}: Props) => {
  return (
    <Flex direction="column" gap="3">
      <ScrollArea
        size="2"
        type="always"
        scrollbars="vertical"
        style={{ width: "100%", height: "75vh" }}
      >
        <Flex direction="column" gap="2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  );
};
