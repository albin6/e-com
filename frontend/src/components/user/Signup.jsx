import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/Slices/userSlice";
import CreateUserIcon from "../../assets/CreateUserIcon";
import { axiosInstance } from "../../config/axiosInstance";
import { OTPModal } from "./OTPEnterModal";

// Validation Schema
const validationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[A-Za-z]+$/, "First name should only contain alphabets")
    .required("First name is required"),
  lastName: Yup.string()
    .matches(/^[A-Za-z]+$/, "Last name should only contain alphabets")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one digit")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [form_data, setFormData] = useState(null);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [otpErrMessage, setOtpErrMessage] = useState("");

  const handleSubmit = async (values) => {
    console.log("Signup attempted with:", values);
    setFormData((prev) => (prev = values));
    try {
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: values.email,
      });
      if (response.data.success) {
        setIsOTPModalOpen(true);
        setOtpMessage("OTP sent successfully. Please check your email.");
        setOtpErrMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOTPSubmit = async (otp) => {
    console.log("OTP submitted:", otp, form_data.email);
    try {
      // Here you would typically send the OTP to your backend for verification
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
        email: form_data.email,
      });
      console.log(response?.data);
      if (response.data.invalid) {
        setOtpErrMessage(response.data.message);
        setOtpMessage("");
      }

      if (response.data.expires) {
        setOtpErrMessage(response.data.message);
        setOtpMessage("");
      }

      if (response?.data?.success) {
        setIsOTPModalOpen(false);
        handleFormSubmit();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const resendOTPHandle = async () => {
    try {
      setOtpErrMessage("");
      const response = await axiosInstance.post("/api/users/send-otp", {
        email: form_data.email,
      });
      if (response.data.success) {
        setOtpMessage("OTP sent successfully. Please check your email.");
        setOtpErrMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormSubmit = async () => {
    const response = await axiosInstance.post("/api/users/signup", {
      first_name: form_data.firstName,
      last_name: form_data.lastName,
      email: form_data.email,
      phone_number: form_data.phoneNumber,
      password: form_data.password,
    });
    console.log(response.data);

    if (response?.data?.success) {
      localStorage.setItem(
        "access_token",
        JSON.stringify(response?.data?.access_token)
      );
      dispatch(setUserDetails(response.data?.new_user));
      navigate("/");
    }

    try {
    } catch (error) {
      console.log(error);
    }
    // Add your signup logic here
  };

  // Call the handleRedirect function after the user is redirected to the /google/callback route
  const google_signup = async () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth/google`;
  };

  return (
    <div className="min-h-screen w-screen fixed top-0 -z-10 bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-7xl w-full fixed content-center top-28 grid grid-cols-2 gap-8 py-8 px-14 bg-white rounded-xl shadow-2xl border border-gray-200">
        <div className="hidden md:block h-[700px] ml-3 mt-2">
          <img
            src="/login.jpg" // Update with your image path
            alt="Smartphone illustration"
            className="h-full rounded-lg"
          />
        </div>
        <div>
          <div className="flex flex-col justify-center mb-5">
            <CreateUserIcon />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Join our smartphone community
            </p>
          </div>
          {error && (
            <p className="mt-2 text-center text-sm text-red-700">{error}</p>
          )}
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              phoneNumber: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <Field
                      name="firstName"
                      type="text"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                  <div className="w-1/2">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      className="mt-1 px-3 py-2 border rounded w-full"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 px-3 py-2 border rounded w-full"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Phone number
                  </label>
                  <Field
                    name="phoneNumber"
                    type="text"
                    className="mt-1 px-3 py-2 border rounded w-full"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="mt-1 px-3 py-2 border rounded w-full"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm password
                  </label>
                  <Field
                    name="confirmPassword"
                    type="password"
                    className="mt-1 px-3 py-2 border rounded w-full"
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Sign up
                </button>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={google_signup}
                    >
                      <span className="sr-only">Sign up with Google</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() => {
                        // Add Facebook signup logic here

                        console.log("Sign up with Facebook clicked");
                      }}
                    >
                      <span className="sr-only">Sign up with Facebook</span>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
          <OTPModal
            isOpen={isOTPModalOpen}
            closeModal={() => setIsOTPModalOpen(false)}
            onSubmit={handleOTPSubmit}
            onResendOTP={resendOTPHandle}
            otpMessage={otpMessage}
            otpErrMessage={otpErrMessage}
          />
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="#"
                className="font-medium text-gray-800 hover:text-gray-700"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
