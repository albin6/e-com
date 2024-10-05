import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../utils/category/categoryCRUD";
import { getBrandList } from "../utils/brand/brandCRUD";

export function useUserAuth() {
  const user = useSelector((state) => state.user.userInfo);
  return user;
}

// -----------------------------------------------------------
// for category
export const useCategoryList = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
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
// -------------------------------------------------------------

// -------------------------------------------------------------
// for brand
export const useBrandList = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrandList,
  });
};

export const useBrandListMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("brands");
    },
  });
};
