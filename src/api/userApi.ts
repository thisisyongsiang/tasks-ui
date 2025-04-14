import { User } from "../components/auth/types";
import { baseFetch } from "./api";

const baseRoute = "users";

export const userSignup = async (email: string, password: string) => {
  const response = await baseFetch(`${baseRoute}/signup`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();      
    throw new Error(errorData.message || 'Signup failed');
  }
  const data = await response.json();
  return data;
};

export const userLogin = async (email: string, password: string):Promise<{user:User,token:string}> => {
  const response = await baseFetch(`${baseRoute}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const errorData = await response.json();      
    throw new Error(errorData.message || 'Login failed');
  }
  const data = await response.json();
  return data;
};
