"use client";

import { createContext, useState } from "react";

export const Context = createContext();

export default function ContextProvider({ children }) {
  const [lastViewedPhoto, setLastViewedPhoto] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(false);

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
