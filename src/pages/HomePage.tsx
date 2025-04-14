import { Button,  Flex, Heading, Text } from "@radix-ui/themes";
import React from "react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <Flex direction="column" gap="4" align="center" justify="center" height="100vh">
      <Heading size="8">Welcome to My Tasks</Heading>
      <Text size="4" align="center">
        Manage your tasks efficiently and stay organized.
      </Text>
      <Flex gap="3">
        <Button variant="soft" color="blue">
          <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Login</Link>
        </Button>
        <Button variant="outline" color="blue">
          <Link to="/signup" style={{ color: 'inherit', textDecoration: 'none' }}>Signup</Link>
        </Button>
      </Flex>
    </Flex>
  );
};
