import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { ShieldCheck } from "lucide-react"; // Replacing the icon to signify admin
import { Link } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle admin login logic here
    console.log("Admin login attempted with:", { email, password, rememberMe });
  };

  return (
    <div className="min-h-screen w-screen fixed bg-gradient-to-br from-gray-100 to-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full fixed content-center top-1/4 gap-8 p-8 bg-white rounded-xl shadow-2xl border border-gray-200 h-[550px]">
        {/* Right Side - Form Section */}
        <div>
          <div className="flex flex-col justify-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-gray-900" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 text-center">
              Admin Portal
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Sign in with your admin credentials
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="sr-only">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Admin Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked)}
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </Label>
              </div>

              <div className="text-sm">
                <Link className="font-medium text-gray-600 hover:text-gray-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Sign in as Admin
              </Button>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Not an admin?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-800 hover:text-gray-700"
              >
                Go to user login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
