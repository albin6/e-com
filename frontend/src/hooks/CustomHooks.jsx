import { useSelector } from "react-redux";

export function useUserAuth() {
  const user = useSelector((state) => state.user.userInfo);
  return user;
}
