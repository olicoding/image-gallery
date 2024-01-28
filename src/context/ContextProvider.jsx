"use client";

import React, { createContext, useReducer } from "react";

const initialState = {
  lastViewedPhoto: null,
  currentPhoto: null,
  photos: [],
  user: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_LAST_VIEWED_PHOTO":
      return { ...state, lastViewedPhoto: action.payload };
    case "SET_CURRENT_PHOTO":
      return { ...state, currentPhoto: action.payload };
    case "SET_PHOTOS":
      return { ...state, photos: action.payload };
    case "SET_USER":
      return { ...state, user: action.payload };
    default:
      throw new Error();
  }
}

export const Context = createContext();

export default function ContextProvider({ children, initialImages }) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    photos: initialImages || [],
  });

  const value = {
    state,
    dispatch,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
