import HiveLogo from "../assets/polenx.png";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Link, useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { resetAccount, openLoginModal, closeLoginModal } from "../redux/store";
import { logout } from "../redux/auth/authSlice";
import { useDispatch } from "react-redux";
export default function WelcomeNavBar() {
  const dispatch = useDispatch();

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isModalOpen = useSelector((state) => state.modalLogin.isLoginModalOpen);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const username = useSelector((state) => state.auth.username);
  const navigate = useNavigate();
  const toggleModal = () => {
    if (isLoggedIn || isModalOpen) {
      dispatch(closeLoginModal()); // Close the modal
    } else {
      dispatch(openLoginModal()); // Open the modal
    }
  };
  const handleLinkClick = (path) => {
    setIsMobileMenuOpen(false);
    console.log(`navigating to ${path}`);
    navigate(path);
  };
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    // dispatch(login("John"));
    toggleModal();
  };
  const handleLogout = () => {
    // dispatch(login("John"));
    dispatch(logout());
    dispatch(resetAccount());
  };

  return (
    <>
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 text-white">
                <img src={HiveLogo} alt="Logo" className="h-8 w-8" />
              </div>
              {/* Main menu on larger screens */}
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  to="/"
                >
                  Home
                </Link>
                <Link
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  to="/exchange"
                >
                  Exchange
                </Link>
                <Link
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  to="/swap"
                >
                  Swap
                </Link>
              </div>
            </div>
            {/* User-related elements (Login, Username) on smaller screens */}
            <div className="flex items-center space-x-4 ml-auto md:ml-0">
              {isLoggedIn ? (
                // Logout button
                <>
                  <span className="text-sm font-medium text-white">
                    {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-300 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              ) : (
                // Login button
                <button
                  onClick={handleLogin}
                  className="text-sm font-medium text-gray-300 hover:text-white"
                >
                  {username ? username : "Login"}
                </button>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:bg-gray-700 hover:text-white inline-flex items-center justify-center p-2 rounded-md focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                <span className="sr-only">Open main menu</span>
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu options */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="ml-4 flex flex-col items-center">
              <span
                onClick={() => handleLinkClick("/")}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium mb-2 cursor-pointer"
              >
                Home
              </span>
              <span
                onClick={() => handleLinkClick("/exchange")}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium cursor-pointer"
              >
                Exchange
              </span>
              <span
                onClick={() => handleLinkClick("/swap")}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-base font-medium cursor-pointer"
              >
                Swap
              </span>
            </div>
          </div>
        )}
      </nav>
      <LoginModal isOpen={isModalOpen} onClose={toggleModal} />
      <Outlet />
    </>
  );
}
