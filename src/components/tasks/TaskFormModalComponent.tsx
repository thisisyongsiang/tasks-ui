import React, { useEffect, useState } from "react";
import {
  allStatusWithoutDeleted,
  CreateTaskRequest,
  Status,
  Task,
} from "./types";
import {
  Dialog,
  Flex,
  Text,
  Button,
  TextField,
  TextArea,
  Select,
} from "@radix-ui/themes";
import { DatePicker } from "../shared/DatePicker";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicHolidayData } from "../../api/externalApi";

interface Props {
  taskToEdit?: Task;
  open: boolean;
  onSubmit: (task: CreateTaskRequest, taskId?: string) => void;
  onClose: () => void;
  isLoading: boolean;
  resetForm: boolean;
}

export const TaskFormModalComponent = ({
  taskToEdit,
  onClose,
  open,
  onSubmit,
  isLoading,
  resetForm,
}: Props) => {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    taskToEdit?.dueDate ? taskToEdit.dueDate : undefined
  );
  const [priority, setPriority] = useState(
    taskToEdit?.priority?.toString() || "5"
  );
  const [status, setStatus] = useState<Status>("PENDING");
  const { data: publicHolidaysData } = useQuery({
    queryKey: ["public-holidays"],
    queryFn: async () => {
      const year = new Date().getFullYear();
      return [
        ...(await fetchPublicHolidayData("SG", year - 1)),
        ...(await fetchPublicHolidayData("SG", year)),
        ...(await fetchPublicHolidayData("SG", year + 1)),
      ].map((d) => {
        return new Date(d.date);
      });
    },
    refetchOnWindowFocus: false,
    retry: false,
  });
  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title");
    const description = formData.get("description");
    setTitle(title?.toString() || "");
    setDescription(description?.toString() || "");
    if (!title || !description || !dueDate) {
      return;
    }
    const task: CreateTaskRequest = {
      title: title.toString(),
      description: description.toString(),
      dueDate: dueDate,
      priority: parseInt(priority),
      status: status,
    };
    onSubmit(task, taskToEdit?.id);
  };

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || "");
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority?.toString() || "5");
      setDueDate(taskToEdit.dueDate ? new Date(taskToEdit.dueDate) : undefined);
      setStatus(taskToEdit.status || "PENDING");
    }
    if (resetForm) {
      setTitle("");
      setDescription("");
      setPriority("5");
      setDueDate(undefined);
    }
  }, [resetForm, taskToEdit]);
  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Title>
          {taskToEdit ? "Update Task" : "Create Task"}
        </Dialog.Title>
        <Dialog.Description>
          <Text size="2" mb="4">
            {taskToEdit
              ? "Update the task details below."
              : "Create a new task below."}
          </Text>
        </Dialog.Description>
        <form action={handleSubmit}>
          <Flex direction="column" gap="3">
            <TextField.Root
              name="title"
              defaultValue={title}
              placeholder="Title"
              required
              disabled={isLoading}
            />
            <TextArea
              defaultValue={description}
              name="description"
              placeholder="Description"
              required
              disabled={isLoading}
            />
            <StyledInputContainer>
              <Text>Due Date:</Text>
              <DatePicker
                disabled={isLoading}
                selectedDate={dueDate}
                setSelectedDate={setDueDate}
                publicHolidaysDate={publicHolidaysData}
              />
              {!dueDate && (
                <Text as="p" size="1" color="red">
                  * Please Select a Due Date
                </Text>
              )}
            </StyledInputContainer>
            <StyledInputContainer>
              <Text>Priority:</Text>
              <Select.Root
                disabled={isLoading}
                defaultValue={priority.toString()}
                value={priority.toString()}
                onValueChange={setPriority}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="0">0</Select.Item>
                  <Select.Item value="1">1</Select.Item>
                  <Select.Item value="2">2</Select.Item>
                  <Select.Item value="3">3</Select.Item>
                  <Select.Item value="4">4</Select.Item>
                  <Select.Item value="5">5</Select.Item>
                </Select.Content>
              </Select.Root>
            </StyledInputContainer>
            <StyledInputContainer>
              <Text>Status:</Text>
              <StyledSelect
                disabled={isLoading}
                defaultValue={status.toString()}
                onValueChange={(val) => setStatus(val as Status)}
              >
                <Select.Trigger />
                <Select.Content>
                  {allStatusWithoutDeleted.map((status) => (
                    <Select.Item key={status} value={status}>
                      {status}
                    </Select.Item>
                  ))}
                </Select.Content>
              </StyledSelect>
            </StyledInputContainer>
            <Flex gap="3" mt="4" justify="end">
              <Dialog.Close>
                <Button variant="soft" color="gray" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading}>
                {taskToEdit ? "Edit Task" : "Create Task"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
};

const StyledInputContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const StyledSelect = styled(Select.Root)`
  width: 100%;
`;
