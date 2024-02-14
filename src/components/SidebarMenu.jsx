"use client";

import { useContext, useRef, useState } from "react";
import { Context } from "@/context/ContextProvider";
import useOutsideClick from "@/utils/useOutsideClick";
import Button from "@/server-components/button/Button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/server-components/svg/Icons";

export default function SidebarMenu() {
  const { state, dispatch } = useContext(Context);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef();

  let carouselActive;

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

  return (
    <>
      <div
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-40 h-full transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "w-64" : "w-0"
        } overflow-hidden bg-gray-800 shadow-xl`}
      >
        <div className="overflow-y-auto pt-20">
          <div className="flex-1 overflow-y-auto p-2">
            {directories.map((directory, index) => (
              <div key={index} className="mb-5">
                <Button
                  className="flex h-9 w-full cursor-pointer items-center rounded-md px-4 text-sm font-medium transition-colors"
                  onClick={() => handleDirectoryChange(directory.name)}
                >
                  <span className="truncate">{directory.name}</span>
                  <span className="ml-auto text-xs font-normal">
                    ({directory.images})
                  </span>
                  <ChevronRightIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        className={`${state.viewMode === "carousel" ? "z-0" : "z-50"} ${
          isSidebarOpen ? "fixed left-[200px]" : "absolute left-0"
        } top-2 h-8 w-8 rounded-lg border-none p-2 transition-transform duration-300 ease-in-out focus:outline-none`}
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
