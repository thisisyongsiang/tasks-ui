import React from "react";
import { Card, Flex, Text, Button, Heading } from "@radix-ui/themes";
import { format } from "date-fns";
import { Task } from "./types";
import { getUser } from "../../services/authService";
import styled from "styled-components";

interface Props {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: Props) => {
  const user = getUser();
  return (
    <Card>
      <Flex direction="column" gap="2">
        <HeadingContainer>
          <Heading>{task.title}</Heading>
          <Button variant="soft" onClick={() => onEdit(task)}>
            Edit
          </Button>
        </HeadingContainer>
        <Text size="1" color="gray">
          Description:
        </Text>
        <StyledDescription>
          <Text size="2">{task.description}</Text>
        </StyledDescription>
        {task.dueDate && (
          <Text size="1">Due Date: {format(task.dueDate, "yyyy-MM-dd")}</Text>
        )}
        <Text size="2">Status: {task.status}</Text>
        <Text size="2">Priority: {task.priority}</Text>
        <Flex gap="2" mt="3">
          {user?.role === "ADMIN" && (
            <Button
              color="red"
              variant="soft"
              onClick={() => task.id && onDelete(task.id)}
            >
              Delete
            </Button>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};

const StyledDescription = styled.div`
  border: 1px solid #ccc;
  min-height: 50px;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
