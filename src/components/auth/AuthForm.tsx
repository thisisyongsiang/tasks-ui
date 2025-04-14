import styled from "styled-components";

import React from "react";
import { Button, TextField, Tooltip } from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface Props {
  loading: boolean;
  onSubmit: (email: string | undefined, password: string | undefined) => void;
  title: string;
  passwordTooltip?: string;
}

export const AuthForm = ({
  loading,
  onSubmit,
  title,
  passwordTooltip,
}: Props) => {
  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    onSubmit(email, password);
  };

  return (
    <Form action={handleSubmit}>
      <h2>{title}</h2>
      <label htmlFor="email">Email</label>
      <TextField.Root
        name="email"
        type="text"
        id="email"
        placeholder="Email"
        disabled={loading}
      />
      <LabelContainer>
        <label htmlFor="password">Password </label>
        {passwordTooltip && (
          <Tooltip content={passwordTooltip}>
            <InfoCircledIcon />
          </Tooltip>
        )}
      </LabelContainer>
      <TextField.Root
        name="password"
        type="password"
        id="password"
        placeholder="Password"
        disabled={loading}
      />
      <Button disabled={loading} type="submit">
        {loading ? "Loading..." : title}
      </Button>
    </Form>
  );
};
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 700px;
  margin: 20px auto;
`;

const LabelContainer = styled.div`
  align-items: center;
  display: flex;
  gap: 5px;
`;
