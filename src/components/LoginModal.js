import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/auth/authThunk";

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const modalRef = useRef(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login({ username: username, onClose }));
  };

  useEffect(() => {
    const handleMouseDownOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleMouseDownOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDownOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
      <div ref={modalRef} className="bg-white p-8 rounded-md w-72">
        <h2 className="text-2xl font-bold mb-4">Login to Your Hive Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="border rounded-md p-2 w-full"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className="flex justify-end mb-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Login
            </button>
          </div>
        </form>

        <p className="text-sm mb-2">Don't have a Hive account yet?</p>
        <div className="flex justify-between">
          <a
            href="https://ecency.com/signup?referral=igormuba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Register on Ecency
          </a>
          <a
            href="https://peakd.com/register?ref=igormuba"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Register on PeakD
          </a>
        </div>

        <p className="text-sm mt-4">
          Already have a Hive account but no Hive Keychain?
        </p>
        <div className="flex justify-center">
          <a
            href="https://hive-keychain.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Download Hive Keychain
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
