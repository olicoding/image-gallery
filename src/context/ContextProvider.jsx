"use client";

import React, { createContext, useMemo, useReducer } from "react";

const initialState = {
  user: null,
  viewMode: "grid",
  currentPhoto: null,
  currentDirectory: "homegallery",
  allDirectories: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_VIEW_MODE":
      return { ...state, viewMode: action.payload };
    case "SET_CURRENT_PHOTO":
      return { ...state, currentPhoto: action.payload };
    case "SET_CURRENT_DIRECTORY":
      return { ...state, currentDirectory: action.payload };
    case "UPDATE_IMAGE_ORDER_IN_FOLDER":
      const { currentDirectory, updatedPhotos } = action.payload;
      const updatedDirectoryStructure = { ...state.allDirectories };
      updatedDirectoryStructure[currentDirectory] = updatedPhotos;
      return { ...state, allDirectories: updatedDirectoryStructure };
    default:
      return state;
  }
}

export const Context = createContext();

export default function ContextProvider({ children, directories }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    allDirectories: directories || {},
  });

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
