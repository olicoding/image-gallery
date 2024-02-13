"use client";

import React, { useContext } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/server-components/svg/Icons";
import Button from "@/server-components/button/Button";
import { useCollapsibleContext } from "@/context/CollapsibleContext";
import { Context } from "@/context/ContextProvider";

export default function SidebarMenu() {
  const { state, dispatch } = useContext(Context);
  const { isOpen, toggle } = useCollapsibleContext();

  const handleDirectoryChange = (directoryPath) => {
    dispatch({
      type: "SET_CURRENT_DIRECTORY",
      payload: directoryPath,
    });
  };

  const directories = Object.keys(state.allDirectories).map((directoryName) => {
    const directory = state.allDirectories[directoryName];
    console.log("directory: ", directory);
    const imagesCount = directory.length;

    return { name: directoryName, images: imagesCount };
  });

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-50 h-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden bg-gray-800 shadow-xl`}
      >
        <div className="overflow-y-auto pt-16">
          <div className="flex-1 overflow-y-auto p-2 pt-8">
            {directories.map((directory, index) => (
              <div key={index} className="space-y-1 text-white">
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
        className={`${
          isOpen ? "fixed left-[200px]" : "absolute left-0"
        } top-2 z-50 h-8 w-8 rounded-lg border-none p-2 transition-transform duration-300 ease-in-out focus:outline-none`}
        size="icon"
        variant="ghost"
        onClick={toggle}
      >
        {isOpen ? (
          <ChevronLeftIcon className="border-0 text-white focus:outline-none" />
        ) : (
          <ChevronRightIcon className="border-0 text-white focus:outline-none" />
        )}
      </Button>
    </>
  );
}
