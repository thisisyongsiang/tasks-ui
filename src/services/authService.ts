import { User } from "../components/auth/types";

export const onLogin = async (user: User, token: string): Promise<void> => {
  // Store the token and user data in local storage for persistence
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const logout = () => {
  // Clear the token and user data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  // Check if the user is authenticated
  return !!localStorage.getItem("token");
};

export const getUser = (): User | null => {
  const userString = localStorage.getItem("user");
  if (userString) {
    return JSON.parse(userString);
  }
  return null;
};

export const isAdmin = (): boolean => {
  return getUser()?.role === "ADMIN";
};
