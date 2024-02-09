"use client";

import React, { createContext, useMemo, useReducer } from "react";

const initialState = {
  user: null,
  photos: [],
  currentPhoto: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "SET_PHOTOS":
      return { ...state, photos: action.payload };
    case "TEMP_UPDATE_PHOTOS":
      return { ...state, photos: action.payload };
    case "SET_CURRENT_PHOTO":
      return { ...state, currentPhoto: action.payload };
    default:
      throw new Error("Unhandled action type: " + action.type);
  }
}

export const Context = createContext();

export default function ContextProvider({ children, initialImages }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    photos: initialImages || [],
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
