"use client";

import React, {
  useRef,
  useState,
  useContext,
  useEffect,
  Suspense,
} from "react";
import { useFormState } from "react-dom";
import { Context } from "@/context/ContextProvider";
import { handleLogin, handleLogout } from "@/app/actions";
import useOutsideClick from "@/utils/useOutsideClick";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import { CollapsibleProvider } from "@/context/CollapsibleContext";
import { CldUploadButton } from "next-cloudinary";

const SidebarMenu = React.lazy(() => import("@/components/SidebarMenu"));

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
      dispatch({ type: "SET_USER", payload: { role: "Admin" } });
      resetDropdown();
    }
  }, [formState, dispatch]);

  return (
    <header className="flex min-h-10 justify-end bg-black px-5 pb-1 pt-3 text-white">
      <Suspense>
        {state.user ? (
          <nav className="flex w-full justify-end gap-5">
            {state.user ? (
              <>
                <CollapsibleProvider>
                  <SidebarMenu />
                </CollapsibleProvider>

                <CldUploadButton
                  className="hover:underline"
                  uploadPreset="bqmxpio4"
                />
              </>
            ) : null}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleLogoutClick();
              }}
              className="hover:underline"
            >
              Logout
            </button>
          </nav>
        ) : (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="ml-auto hover:underline"
          >
            Admin
          </button>
        )}
      </Suspense>
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
