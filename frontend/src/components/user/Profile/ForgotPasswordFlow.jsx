import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import EmailEntry from "./EmailEntry";
import OTPVerification from "./OTPVerification";
import NewPassword from "./NewPassword";
import { axiosInstance } from "../../../config/axiosInstance";

import { toast } from "react-toastify";

export default function ForgotPasswordFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");

  const handleEmailSubmit = async (submittedEmail) => {
    // Here you would typically call an API to send the OTP
    console.log("Sending OTP to:", submittedEmail);
    setEmail(submittedEmail);
    try {
      const response = await axiosInstance.post(
        "/api/users/send-verification-otp",
        {
          email: submittedEmail,
        }
      );
      setStep("otp");
      toast.success("OTP sent successfully. Please check your email.", {
        position: "top-center",
      });
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      console.log(error);
    }
  };

  const handleOTPVerify = async (otp) => {
    // Here you would typically call an API to verify the OTP
    console.log("Verifying OTP:", otp);
    try {
      // Here you would typically send the OTP to your backend for verification
      const response = await axiosInstance.post("/api/users/verify-otp", {
        otp,
        email,
      });
      console.log(response?.data);
      setStep("newPassword");
    } catch (error) {
      toast.error(error.response.data.message, {
        position: "top-center",
      });
      console.error("Error verifying OTP:", error);
    }
  };

  const handlePasswordReset = async (password) => {
    // Here you would typically call an API to reset the password
    console.log("Resetting password for:", email);
    try {
      // Send the new password to the backend API

      const response = await axiosInstance.post(
        "/api/users/reset-the-password",
        {
          password,
        }
      );
      toast.success("Password reset successfully", {
        position: "top-center",
      });
      setTimeout(() => navigate("/profile"), 1000);
    } catch (err) {
      console.log(err);
    }
    // Redirect to login page or show success message
  };

  const handleOTPResend = async () => {
    try {
      const response = await axiosInstance.post(
        "/api/users/send-verification-otp",
        {
          email,
        }
      );
      if (response.data.success) {
        toast.success("OTP sent successfully. Please check your email.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <Link
            to={"/profile"}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Profile
          </Link>
        </div>
        {step === "email" && <EmailEntry onSubmit={handleEmailSubmit} />}
        {step === "otp" && (
          <OTPVerification
            onVerify={handleOTPVerify}
            email={email}
            onResendOTP={handleOTPResend}
          />
        )}
        {step === "newPassword" && (
          <NewPassword onSubmit={handlePasswordReset} />
        )}
      </div>
    </div>
  );
}
