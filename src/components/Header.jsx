"use client";

import { useRef, useState, useContext, useEffect } from "react";
import { useFormState } from "react-dom";
import { Context } from "@/context/ContextProvider";
import { handleLogin, handleLogout } from "@/app/actions";
import useOutsideClick from "@/utils/useOutsideClick";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";

export default function Header() {
  const { state, dispatch } = useContext(Context);
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [formState, formAction] = useFormState(handleLogin, undefined);
  const router = useRouter();

  const resetDropdown = () => {
    formAction();
    setShowDropdown(false);
    setAdminPassword("");
  };

  const handleLogoutClick = async () => {
    formAction();
    await handleLogout();
    dispatch({ type: "SET_USER", payload: null });
    resetDropdown();
    router.push("/");
  };

  useOutsideClick(dropdownRef, resetDropdown);
  useKeypress("Escape", resetDropdown);

  useEffect(() => {
    if (formState === true) {
      resetDropdown();
      dispatch({ type: "SET_USER", payload: { role: "Admin" } });
      router.push("/admin", { scroll: false });
    }
  }, [formState, dispatch]);

  return (
    <header className="flex justify-end bg-black px-5 pb-1 pt-3 text-white">
      {state.user ? (
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogoutClick();
          }}
          className="hover:underline"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="hover:underline"
        >
          Admin
        </button>
      )}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute right-4 top-10 z-10 w-28 bg-transparent bg-white shadow-lg"
        >
          <form action={formAction}>
            <input
              className="w-full rounded-md border p-1 text-black"
              type="password"
              name="password"
              placeholder="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              autoFocus
              required
            />

            <div>
              {formState !== true && formState && (
                <p className="mx-1 bg-white text-center text-xs text-red-500">
                  {formState}
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
