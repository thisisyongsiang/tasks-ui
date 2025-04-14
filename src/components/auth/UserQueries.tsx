import { useMutation } from "@tanstack/react-query";
import { userLogin, userSignup } from "../../api/userApi";
import { onLogin } from "../../services/authService";
import { QueryKeyConstants } from "../../utils/QueryConstants";

export const useUserSignupMutation = () => {
  return useMutation({
    mutationKey: [QueryKeyConstants.Signup],
    mutationFn: async (user: { email: string; password: string }) => {
      await userSignup(user.email, user.password);
    },
  });
};

export const useUserLoginMutation = () => {
    return useMutation({
      mutationKey: [QueryKeyConstants.Login],
      mutationFn: async (user: { email: string; password: string }) => {
        return await userLogin(user.email, user.password);
      },
      onSuccess: (result) => {
        onLogin(result.user, result.token);
      }
    });
  };
  
