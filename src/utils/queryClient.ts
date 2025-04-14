import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { logout } from "../services/authService";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error?.status === 401
      ) {
        // Handle 401 Unauthorized error
        // Logout
        logout();
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        error?.status === 401
      ) {
        // Handle 401 Unauthorized error
        // Logout
        logout();
      }
    },
  }),
});
