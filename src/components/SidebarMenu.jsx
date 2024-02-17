"use client";

import { useRef, useState, useContext, useEffect } from "react";
import { Context } from "@/context/ContextProvider";
import useOutsideClick from "@/utils/useOutsideClick";
import Button from "@/server-components/button/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/server-components/svg/Icons";
import useKeypress from "react-use-keypress";
import { useFormState, useFormStatus } from "react-dom";
import { CldUploadButton } from "next-cloudinary";
import { useRouter } from "next/navigation";
import { handleLogin, handleLogout, refreshSession } from "@/app/actions";
import { motion } from "framer-motion";
import { UserIcon } from "@/server-components/svg/User";

function PasswordInput({ adminPassword, setAdminPassword }) {
  const { pending } = useFormStatus();

  return (
    <input
      className="w-full rounded-md border p-1 text-black"
      type="password"
      name="password"
      placeholder="password"
      value={adminPassword}
      onChange={(e) => setAdminPassword(e.target.value)}
      autoFocus
      required
      disabled={pending}
      aria-disabled={pending}
    />
  );
}

export default function SidebarMenu() {
  const { state, dispatch } = useContext(Context);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();
  const dropdownRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [admin, setAdmin] = useState(null);
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
    setAdmin(null);
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

    const checkAuth = async () => {
      const response = await refreshSession();
      setAdmin(response.success);
    };

    checkAuth();
  }, [formState, dispatch]);

  useOutsideClick(sidebarRef, () => setIsSidebarOpen(false));

  const handleDirectoryChange = (directoryPath) => {
    dispatch({
      type: "SET_CURRENT_DIRECTORY",
      payload: directoryPath,
    });
    setIsSidebarOpen(false);
  };

  const directories = Object.keys(state.allDirectories).map((directoryName) => {
    const directory = state.allDirectories[directoryName];
    const imagesCount = directory.length;

    return { name: directoryName, images: imagesCount };
  });

  const overlayVariants = {
    hidden: { opacity: 0, transition: { duration: 0.3 } },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const sidebarVariants = {
    open: {
      scaleX: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    closed: {
      scaleX: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  };

  return (
    <>
      {isSidebarOpen && (
        <motion.div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <motion.div
        ref={sidebarRef}
        className="fixed left-0 top-0 z-40 h-full min-w-[200px] transform overflow-hidden bg-gray-800 shadow-xl"
        variants={sidebarVariants}
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        style={{ transformOrigin: "left" }}
      >
        <div className="relative py-4">
          <div className="w-100 overflow-y-auto pt-20">
            <h2 className="mb-3 pl-4">Albums</h2>
            <div className="flex-1 overflow-y-auto py-2">
              {directories.map((directory, index) => (
                <div key={index} className="mb-4">
                  <Button
                    className="flex h-6 w-full cursor-pointer items-center rounded-md px-4 text-sm font-medium transition-colors"
                    onClick={() => handleDirectoryChange(directory.name)}
                  >
                    <span className="truncate">
                      {directory.name.toLocaleLowerCase()}
                    </span>
                    <span className="ml-auto text-xs font-normal">
                      ({directory.images})
                    </span>
                    <ChevronRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute right-4 top-4">
            {admin ? (
              <nav className="flex w-full justify-end gap-5">
                <CldUploadButton
                  className="hover:underline"
                  uploadPreset="bqmxpio4"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogoutClick();
                  }}
                  className="hover:underline"
                >
                  logout
                </button>
              </nav>
            ) : (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="ml-auto hover:underline"
              >
                <UserIcon />
              </button>
            )}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 top-8 z-10 w-20 bg-transparent bg-white shadow-lg"
              >
                <form action={formAction}>
                  <PasswordInput
                    adminPassword={adminPassword}
                    setAdminPassword={setAdminPassword}
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
          </div>
        </div>
      </motion.div>
      <Button
        className={`${
          state.viewMode === "carousel" ? "z-0" : "z-50"
        } absolute left-0 top-2 h-8 w-8 rounded-lg border-none p-2 transition-transform duration-300 ease-in-out focus:outline-none`}
        size="icon"
        variant="ghost"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <ChevronLeftIcon className="border-0 text-white focus:outline-none" />
        ) : (
          <ChevronRightIcon className="border-0 text-white focus:outline-none" />
        )}
      </Button>
    </>
  );
}
