import { useGlobalState } from "./globalState";

export const useLastViewedPhoto = () => {
  return useGlobalState("photoToScrollTo");
};
