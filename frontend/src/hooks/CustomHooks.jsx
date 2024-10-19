import { useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategories } from "../utils/category/categoryCRUD";
import { getBrandList } from "../utils/brand/brandCRUD";
import { fetchProductsData } from "../utils/products/adminProductListing";
import { fetchProductsDetails } from "../utils/products/userProductListing";
import { fetchUserAddresses } from "../utils/address/addressCRUD";
import { fetchUserInformation } from "../utils/profile/profileCRUD";
import { getCartProducts } from "../utils/cart/cartCRUD";

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
// -------------------------------------------------------------

// -------------------------------------------------------------
// for products
export const useProductsData = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: fetchProductsData,
  });
};

export const useProductsDataMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });
};
// --------------------------------------------------------------
// --------------------------------------------------------------
// for admin for getting the details of a single product
// for single product
export const useProductData = (queryFunc) => {
  return useQuery({
    queryKey: ["product"],
    queryFn: queryFunc,
  });
};

// --------------------------------------------------------------
// for user products
export const useUserProductsData = () => {
  return useQuery({
    queryKey: ["userProducts"],
    queryFn: fetchProductsDetails,
  });
};

// --------------------------------------------------------------

// --------------------------------------------------------------
// for user product details
export const useUserProduct = (queryFunc) => {
  return useQuery({
    queryKey: ["singleProduct"],
    queryFn: queryFunc,
  });
};
// --------------------------------------------------------------

// --------------------------------------------------------------

// --------------------------------------------------------------
// --------------------------------------------------------------
// for user for getting the details of products of a particular category of brand
export const useCategoryProduct = (queryFunc) => {
  return useQuery({
    queryKey: ["categoryProduct"],
    queryFn: queryFunc,
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for user profile address management
export const useProfileAddress = () => {
  return useQuery({
    queryKey: ["profileAddress"],
    queryFn: fetchUserAddresses,
  });
};

// for adding a new address to the user
export const useProfileAddressMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("profileAddress");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------

// for getting user information
export const useProfileInfo = () => {
  return useQuery({
    queryKey: ["profileInfo"],
    queryFn: fetchUserInformation,
  });
};

// for updating user information
export const useProfileInfoMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("profileInfo");
    },
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for getting products in cart

export const useCartProduct = () => {
  return useQuery({
    queryKey: ["cartProduct"],
    queryFn: getCartProducts,
  });
};

// --------------------------------------------------------------
// --------------------------------------------------------------
// for mutating the products in the cart

export const useCartProductMutation = (mutationFunc) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mutationFunc,
    onSuccess: () => {
      queryClient.invalidateQueries("cartProduct");
    },
  });
};
