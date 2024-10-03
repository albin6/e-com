import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { NavLink } from "../ui/NavLink";
import { IconButton } from "../ui/IconButton";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../redux/Slices/userSlice";
import { axiosInstance } from "../../config/axiosInstance";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Implement your search logic here
  };

  const handleLogout = async (e) => {
    console.log("Logout clicked");
    setIsUserMenuOpen(false);
    try {
      await axiosInstance.post("/api/users/logout");
      localStorage.removeItem("access_token");
      dispatch(logoutUser());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  // Placeholder for user authentication check
  // Replace with your Redux logic

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold">Logo</div>

        <nav className="hidden md:flex space-x-4">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/about">About</NavLink>
          <NavLink href="/contact">Contact</NavLink>
        </nav>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 w-64"
              />
              <Button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </form>

          <IconButton
            icon={<Heart className="h-6 w-6" />}
            label="Wishlist"
            onClick={() => console.log("Wishlist clicked")}
          />

          <IconButton
            icon={<ShoppingCart className="h-6 w-6" />}
            label="Cart"
            onClick={() => console.log("Cart clicked")}
          />

          {user ? (
            <div className="relative">
              <IconButton
                icon={<User className="h-6 w-6" />}
                label="User"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              />
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log("My Account clicked");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Account
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log("My Wishlist clicked");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Wishlist
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log("My Cart clicked");
                      setIsUserMenuOpen(false);
                    }}
                  >
                    My Cart
                  </Button>
                  <Button
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                className=" text-white bg-gray-800 hover:bg-gray-700 focus:outline-none font-semibold py-2 px-4 rounded transition duration-300"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className=" text-white bg-gray-800 hover:bg-gray-700 focus:outline-none font-semibold py-2 px-4 rounded transition duration-300"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
