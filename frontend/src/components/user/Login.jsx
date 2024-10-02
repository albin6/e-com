import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Smartphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/Slices/userSlice";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const handleSubmit = async (values) => {
    console.log("Login attempted with:", values);
    try {
      console.log(values);
      const response = await axiosInstance.post("/api/users/login", values);
      console.log("Server response:", response);
      if (response?.data?.access_token) {
        localStorage.setItem("access_token", response?.data?.access_token);
      }
      dispatch(setUserDetails(response.data.user));
      navigate("/");
      if (response.status === 200) {
        console.log("Login successful");
      } else if (response.status === 401) {
        console.log("Invalid credentials");
      } else {
        console.log("Unknown error");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="min-h-screen w-screen fixed -z-10 bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full fixed content-center top-1/4 grid grid-cols-2 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 h-[550px]">
        {/* Left Side - Image Section */}
        <div className="md:block my-auto h-[410] relative -top-1">
          <img
            src="/loginOne.png"
            alt="Smartphone illustration"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        {/* Right Side - Form Section */}
        <div>
          <div className="flex flex-col justify-center">
            <Smartphone className="mx-auto h-12 w-12 text-gray-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
              Welcome back
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>
          {errors.invalidCredentials && (
            <div className="mt-3 text-base text-center text-red-600">
              {errors.invalidCredentials}
            </div>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="mt-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="sr-only">
                      Email address
                    </Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">
                      Password
                    </Label>
                    <Field
                      as={Input}
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
                    {errors.password && touched.password && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center"></div>

                  <div className="text-sm">
                    <Link className="font-medium text-gray-600 hover:text-gray-500">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Sign in
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link className="font-medium text-gray-800 hover:text-gray-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
