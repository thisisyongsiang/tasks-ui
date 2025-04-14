import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { ErrorModal } from "../shared/ErrorModal";
import { useUserLoginMutation } from "./UserQueries";

export const Login = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate, isPending } = useUserLoginMutation();

  const handleLogin = (
    email: string | undefined,
    password: string | undefined
  ) => {
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }
    mutate(
      { email, password },
      {
        onSuccess: () => {
          navigate("/dashboard"); // Redirect to dashboard after login
        },
        onError: (error) => {
          setErrorMessage(error.message);
        },
      }
    );
  };

  return (
    <>
      <AuthForm loading={isPending} title="Login" onSubmit={handleLogin} />
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
};
