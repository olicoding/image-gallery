"use client";

import React, { useState } from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@/server-components/svg/Icons";
import Button from "@/server-components/button/Button";
import { useCollapsibleContext } from "@/context/CollapsibleContext";

const albums = [
  {
    name: "Vacation Photos",
    images: 120,
    subAlbums: [
      { name: "Summer 2023", images: 80 },
      { name: "Winter 2022", images: 40 },
    ],
  },
  {
    name: "Family Gatherings",
    images: 90,
    subAlbums: [
      { name: "Christmas 2022", images: 50 },
      { name: "Thanksgiving 2022", images: 40 },
    ],
  },
];

export default function SidebarMenu() {
  const [openSections, setOpenSections] = useState({});
  const { isOpen, toggle } = useCollapsibleContext();

  const toggleSection = (name) => {
    setOpenSections((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-50 h-full transform transition-transform duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-0"
        } overflow-hidden bg-gray-800 shadow-xl`}
      >
        <div className="overflow-y-auto pt-16">
          <div className="flex-1 overflow-y-auto p-2 pt-8">
            {albums.map((album, index) => (
              <div key={index} className="space-y-1 text-white">
                <Button
                  className="flex h-9 w-full cursor-pointer items-center rounded-md px-4 text-sm font-medium transition-colors "
                  onClick={() => toggleSection(album.name)}
                >
                  <span className="truncate">{album.name}</span>
                  <span className="ml-2 text-xs font-normal">
                    ({album.images})
                  </span>
                  {openSections[album.name] ? (
                    <ChevronDownIcon className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                  )}
                </Button>
                {openSections[album.name] && (
                  <div className="grid gap-1 border-t border-gray-200 p-2 text-sm dark:border-gray-800">
                    {album.subAlbums.map((sub, subIndex) => (
                      <div key={subIndex} className="pl-4">
                        {sub.name} ({sub.images})
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Button
        className={`fixed ${
          isOpen ? "left-[200px]" : "left-0"
        }  top-2 z-50 h-8 w-8 rounded-lg border-none p-2 transition-transform duration-300 ease-in-out focus:outline-none`}
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
