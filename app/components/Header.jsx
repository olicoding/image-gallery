"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGlobalState } from "@/utils/globalState";
import useOutsideClick from "@/utils/useOutsideClick";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useGlobalState("user");
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const resetDropdown = () => {
    setShowDropdown(false);
    setShowAdminLogin(false);
    setAdminPassword("");
    setLoginError("");
  };

  useOutsideClick(dropdownRef, () => {
    if (showDropdown) {
      resetDropdown();
    }
  });

  const handleVisitorLogin = async () => {
    resetDropdown();
    setUser({ role: "visitor" });
    router.push("/admin");
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (response.ok) {
        resetDropdown();
        setUser({ role: "admin" });
        router.push("/admin");
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginError("An error occurred during login.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <header className="flex justify-end bg-black p-4 text-white">
      {user ? (
        <button onClick={handleLogout} className="hover:underline">
          Logout
        </button>
      ) : (
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="hover:underline"
        >
          Dashboard
        </button>
      )}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-10 z-10 mt-2 w-48 bg-white py-2 shadow-lg"
        >
          <button
            onClick={handleVisitorLogin}
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
          >
            Visitor
          </button>
          <button
            onClick={() => setShowAdminLogin(!showAdminLogin)}
            className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
          >
            Admin
          </button>
          {showAdminLogin && (
            <form onSubmit={handleAdminLogin} className="p-4">
              <input
                type="password"
                placeholder="Enter password"
                autoFocus
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="mb-2 w-full border px-2 py-1 text-black"
              />
              <button
                type="submit"
                className="w-full bg-black px-4 py-2 text-white"
              >
                Login
              </button>
              {loginError && <p className="mt-2 text-red-500">{loginError}</p>}
            </form>
          )}
        </div>
      )}
    </header>
  );
}