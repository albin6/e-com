import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../../redux/Slices/userSlice";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const clientId =
    "447481056732-4t1390i8fon4qu3k94416jqrv2o4vmsk.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("hereeeeeeeeeeeee", credentialResponse);
          dispatch(setUserDetails(credentialResponse));
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
