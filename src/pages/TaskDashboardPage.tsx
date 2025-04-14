import {
  Button,
  Flex,
  IconButton,
  Select,
  Spinner,
  Text,
} from "@radix-ui/themes";
import React, { useState } from "react";
import styled from "styled-components";
import { TaskFormModalComponent } from "../components/tasks/TaskFormModalComponent";
import {
  allStatus,
  allStatusWithoutDeleted,
  CreateTaskRequest,
  Status,
  Task,
} from "../components/tasks/types";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useFetchTaskQuery,
  useUpdateTaskMutation,
} from "../components/tasks/TaskQueries";
import { ErrorModal } from "../components/shared/ErrorModal";
import { TaskListComponent } from "../components/tasks/TaskListComponent";
import ReactPaginate from "react-paginate";
import { DateRangePicker } from "../components/shared/DateRangePicker";
import { ResetIcon } from "@radix-ui/react-icons";
import { useUndoContext } from "../context/UndoContext";
import { isAdmin } from "../services/authService";

export const TaskDashboardPage = () => {
  const { addUndoAction, handleUndo, undoHistory ,isUndoing} = useUndoContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resetForm, setResetForm] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const [filterStatus, setFilterStatus] = useState<Status | undefined>(
    undefined
  );
  const [filterPriority, setFilterPriority] = useState<number | undefined>(
    undefined
  );
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  const [selectedRange, setSelectedRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const { mutate: createMutate, isPending: isCreating } =
    useCreateTaskMutation();

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateTaskMutation();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteTaskMutation();
  const {
    data,
    isPending: fetchIsLoading,
    isError: fetchIsError,
  } = useFetchTaskQuery({
    pageNumber,
    pageSize,
    status: filterStatus,
    priority: filterPriority,
    orderBy: "createdAt",
    order: "desc",
    dueDateStart: selectedRange.from,
    dueDateEnd: selectedRange.to,
  });
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCreateTask = (task: CreateTaskRequest) => {
    createMutate(task, {
      onError: (error) => {
        setErrorMessage(error.message);
      },
      onSuccess: (data) => {
        return (
          data.id &&
          addUndoAction({
            type: "create",
            taskId: data.id,
          })
        );
      },
      onSettled: () => {
        setResetForm(true);
        setTimeout(() => {
          setResetForm(false);
        }, 1);
        setTaskToEdit(undefined);
        setIsModalOpen(false); // Close the modal after mutation
      },
    });
  };

  const handleUpdateTask = (task: CreateTaskRequest, taskId?: string) => {
    updateMutate(
      { id: taskId, ...task },
      {
        onError: (error) => {
          setErrorMessage(error.message);
        },
        onSettled: () => {
          setResetForm(true);
          setTimeout(() => {
            setResetForm(false);
          }, 1);
          setTaskToEdit(undefined);
          setIsModalOpen(false); // Close the modal after mutation
        },
        onSuccess: (_data, _var, previousTask) => {
          return (
            taskId &&
            addUndoAction({
              type: "update",
              taskId: taskId,
              previousChangedFields: {
                title: previousTask.title,
                description: previousTask.description,
                dueDate: previousTask.dueDate,
                priority: previousTask.priority,
                status: previousTask.status,
              },
            })
          );
        },
      }
    );
  };

  const handleDeleteTask = (taskId: string) => {
    deleteMutate(taskId, {
      onError: (error) => {
        setErrorMessage(error.message);
      },
      onSuccess: (_data, _var, previousTask) => {
        return addUndoAction({
          type: "delete",
          taskId: taskId,
          previousChangedFields: { status: previousTask.status },
        });
      },
    });
  };

  const handleEditTask = (task: Task) => {
    setResetForm(true);
    setTimeout(() => {
      setResetForm(false);
    }, 1);
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const isLoading = () => {
    return fetchIsLoading || isCreating || isUpdating || isDeleting||isUndoing;
  };

  return (
    <>
      <StyledContainer>
        <StyledHeader>
          <ActionContainer>
            <Button disabled={isLoading()} onClick={() => handleOpenModal()}>
              Create Tasks
            </Button>
            <Text weight="light" color="gray">
              |
            </Text>
            <IconButton
              variant="soft"
              disabled={undoHistory.length <= 0 || isLoading()}
              onClick={handleUndo}
            >
              <ResetIcon />
            </IconButton>
          </ActionContainer>
          <FilterContainer>
            <FilterGroup>
              <Text>Filter by Status</Text>
              <StyledSelect
                disabled={isLoading()}
                defaultValue={"None"}
                onValueChange={(val) => {
                  setFilterStatus(
                    val !== undefined && !!val && val !== "None"
                      ? (val as Status)
                      : undefined
                  );
                  setPageNumber(1);
                }}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Content>
                    {(isAdmin() ? allStatus : allStatusWithoutDeleted).map(
                      (status) => (
                        <Select.Item key={status} value={status}>
                          {status}
                        </Select.Item>
                      )
                    )}
                    <Select.Item value="None">Clear Filter</Select.Item>
                  </Select.Content>
                </Select.Content>
              </StyledSelect>
            </FilterGroup>
            <FilterGroup>
              <Text>Filter by Priority</Text>
              <StyledSelect
                disabled={isLoading()}
                defaultValue={"None"}
                onValueChange={(val) => {
                  setFilterPriority(
                    val !== undefined && !!val && val !== "None"
                      ? parseInt(val)
                      : undefined
                  );
                  setPageNumber(1);
                }}
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Content>
                    <Select.Item value="0">0</Select.Item>
                    <Select.Item value="1">1</Select.Item>
                    <Select.Item value="2">2</Select.Item>
                    <Select.Item value="3">3</Select.Item>
                    <Select.Item value="4">4</Select.Item>
                    <Select.Item value="5">5</Select.Item>
                    <Select.Item value="None">Clear Filter</Select.Item>
                  </Select.Content>
                </Select.Content>
              </StyledSelect>
            </FilterGroup>
            <FilterGroup>
              <Text>Filter by due date</Text>
              <DateRangePicker
                selectedRange={selectedRange}
                setSelectedRange={(range) => {
                  setSelectedRange(range);
                  setPageNumber(1);
                }}
                disabled={isLoading()}
              />
            </FilterGroup>
          </FilterContainer>
        </StyledHeader>
        {isLoading() ? (
          <SpinnerContainer>
            <Spinner size={"3"} />
          </SpinnerContainer>
        ) : (
          <>
            {!fetchIsError ? (
              <>
                {data?.tasks && data?.totalCount > 0 ? (
                  <Flex direction="column" gap="3">
                    <TaskListComponent
                      tasks={data.tasks}
                      handleDelete={handleDeleteTask}
                      handleEdit={handleEditTask}
                    />
                    <StyledReactPaginate
                      previousLabel={"Previous"}
                      nextLabel={"Next"}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      pageCount={Math.ceil((data.totalCount || 0) / pageSize)}
                      marginPagesDisplayed={2}
                      pageRangeDisplayed={1}
                      onPageChange={(data: { selected: number }) => {
                        setPageNumber(data.selected + 1);
                      }}
                      forcePage={pageNumber - 1} // Set the current page
                    />
                  </Flex>
                ) : (
                  <SpinnerContainer>
                    <Text>No tasks available</Text>
                  </SpinnerContainer>
                )}
              </>
            ) : (
              <Text>Some Error occurred</Text>
            )}
          </>
        )}
      </StyledContainer>
      <TaskFormModalComponent
        taskToEdit={taskToEdit}
        open={isModalOpen}
        onClose={() => {
          setTaskToEdit(undefined);
          setResetForm(true);
          setTimeout(() => {
            setResetForm(false);
          }, 1);
          setIsModalOpen(false);
        }}
        onSubmit={taskToEdit ? handleUpdateTask : handleCreateTask}
        isLoading={isCreating || isUpdating}
        resetForm={resetForm}
      />
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;
const StyledHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const FilterGroup = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;
const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const ActionContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const StyledSelect = styled(Select.Root)`
  width: 100%;
`;
const StyledReactPaginate = styled(ReactPaginate).attrs({
  activeClassName: "active", // Required for styling the active page.
})`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;

  li a {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 0 4px;
    cursor: pointer;
  }

  li.previous a,
  li.next a,
  li.break a {
    border-color: transparent;
  }

  li.active a {
    background-color: #3e63dd;
    color: white;
    border-color: #3e63dd;
  }

  li.disabled a {
    color: #ccc;
    cursor: default;
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
