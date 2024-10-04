import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../utils/category/categoryCRUD";

export function useUserAuth() {
  const user = useSelector((state) => state.user.userInfo);
  return user;
}

export const useCategoryList = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories, // Your data fetching function
  });
};

export const useCategoryListMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("categories");
    },
  });
};
