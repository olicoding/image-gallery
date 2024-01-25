import { createGlobalState } from "react-hooks-global-state";

const initialState = {
  user: false,
  photoToScrollTo: null,
};

export const { useGlobalState } = createGlobalState(initialState);
