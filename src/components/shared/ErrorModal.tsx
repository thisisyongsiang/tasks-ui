// import * as Dialog from "@radix-ui/react-dialog";
import { Dialog } from "@radix-ui/themes";
import React, { useState } from "react";

interface Props {
  message: string | null;
  onClose: () => void;
}
export const ErrorModal = ({ message, onClose }: Props) => {
  const [open, setOpen] = useState(message !== null);

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  React.useEffect(() => {
    setOpen(message !== null);
  }, [message]);
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          setOpen(val);
          handleClose();
        }
      }}
    >
      <Dialog.Content>
        <Dialog.Title>Error</Dialog.Title>
        <p>{message}</p>

        <Dialog.Description className="DialogDescription" />

        <Dialog.Close>
          <button onClick={handleClose}>Close</button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Root>
  );
};
