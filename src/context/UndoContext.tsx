import React, { createContext, useContext, useState } from "react";
import { Task } from "../components/tasks/types";
import {
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../components/tasks/TaskQueries";
import { isAdmin } from "../services/authService";

// For update actions, store only the changed fields
// For delete actions, store only previous status as in the backend for delete,
// we are just changing the status to DELETE
interface UndoAction {
  type: "update" | "create" | "delete";
  taskId: string;
  previousChangedFields?: Partial<Task>; // Store only the previous state of the changed fields
}

interface UndoContextType {
  undoHistory: UndoAction[];
  addUndoAction: (action: UndoAction) => void;
  handleUndo: () => Promise<void>;
  isUndoing: boolean;
}

const UndoContext = createContext<UndoContextType | undefined>(undefined);

export const UndoProvider = ({ children }: { children: React.ReactNode }) => {
  const [undoHistory, setUndoHistory] = useState<UndoAction[]>([]);

  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateTaskMutation();
  const { mutate: deleteMutate, isPending: isDeleting } =
    useDeleteTaskMutation();
  const addUndoAction = (action: UndoAction) => {
    if (action.type === "create" && !isAdmin()) return;
    setUndoHistory((prevHistory) => [...prevHistory, action]);
  };

  const handleUndo = async () => {
    if (undoHistory.length > 0) {
      const lastAction = undoHistory[undoHistory.length - 1];
      try {
        if (lastAction.type === "create") {
          await deleteMutate(lastAction.taskId);
          setUndoHistory((prevHistory) => {
            prevHistory.pop();
            return prevHistory;
          });
        } else if (lastAction.previousChangedFields) {
          // For delete actions, we just need to update the status to the previous status
          // For update actions, we need to restore the previous state of the changed fields
          await updateMutate({
            id: lastAction.taskId,
            ...lastAction.previousChangedFields,
          });
          setUndoHistory((prevHistory) => {
            prevHistory.pop();
            return [...prevHistory];
          });
        }
      } catch (error) {
        // Clears undo history if an error occurs to prevent any odd behaviours
        setUndoHistory([]);
        console.error("Undo error:", error);
      }
    }
  };

  const value: UndoContextType = {
    undoHistory,
    addUndoAction,
    handleUndo,
    isUndoing: isDeleting || isUpdating,
  };

  return <UndoContext.Provider value={value}>{children}</UndoContext.Provider>;
};

export const useUndoContext = () => {
  const context = useContext(UndoContext);
  if (!context) {
    throw new Error("useUndoContext must be used within an UndoProvider");
  }
  return context;
};
