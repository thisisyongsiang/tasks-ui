import React, { useState } from "react";
import { AuthForm } from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { ErrorModal } from "../shared/ErrorModal";
import { useUserSignupMutation } from "./UserQueries";

export const Signup = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { mutate,isPending } = useUserSignupMutation();

  const handleSignup = (
    email: string | undefined,
    password: string | undefined
  ) => {
    if (!email || !password) {
      setErrorMessage("Email and password are required");
      return;
    }
    mutate({ email, password },{
      onSuccess: () => {
        navigate("/login"); // Redirect to login after signup
      },
      onError: (error) => {
        setErrorMessage(error.message);
      },
    });
  };

  return (
    <div>
      <AuthForm
      loading={isPending}
        title="Signup"
        onSubmit={handleSignup}
        passwordTooltip="Password must be minimum 7 characters long with at least one lower case letter and one upper case letter and one number"
      />
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
