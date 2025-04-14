import { Button, Container, Flex, Heading } from "@radix-ui/themes";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../../services/authService";
import { useEffect } from "react";

export const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (isAuthenticated()) {
      if (
        location.pathname === "/login" ||
        location.pathname === "/signup" ||
        location.pathname === "/"
      ) {
        navigate("/dashboard");
      }
    }
  });

  return (
    <Container size="4" p="5">
      <Flex direction="column" gap="4" align="center">
        <Flex justify="between" width="100%">
          <Heading size="6">My Tasks</Heading>
          <Flex gap="3">
            {isAuthenticated() ? (
              <>
                <Button
                  variant="soft"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="soft" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button variant="soft" onClick={() => navigate("/signup")}>
                  Signup
                </Button>
              </>
            )}
          </Flex>
        </Flex>
        <Outlet />
      </Flex>
    </Container>
  );
};
