import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  user: false,
  photoToScrollTo: null,
  photos: [],
};

export const { useGlobalState } = createGlobalState(initialState);
