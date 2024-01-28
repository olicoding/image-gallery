"use client";

import { createContext, useState } from "react";

export const Context = createContext();

export default function ContextProvider({ children, initialImages }) {
  const [lastViewedPhoto, setLastViewedPhoto] = useState(null);
  const [photos, setPhotos] = useState(initialImages || []);
  const [user, setUser] = useState(false);

  console.log("In ContextProvider, initialImages: ", initialImages);

  const value = {
    setLastViewedPhoto,
    lastViewedPhoto,
    setPhotos,
    photos,
    setUser,
    user,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
