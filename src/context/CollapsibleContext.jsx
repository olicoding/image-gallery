"use client";

import { createContext, useContext, useState } from "react";

const CollapsibleContext = createContext();

export const useCollapsibleContext = () => useContext(CollapsibleContext);

export const CollapsibleProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <CollapsibleContext.Provider value={{ isOpen, toggle }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

export default { useCollapsibleContext, CollapsibleProvider };
