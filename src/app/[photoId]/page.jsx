"use client";

import { useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { Context } from "@/context/ContextProvider";
import Loading from "../server-components/Loading";
import CarouselStructure from "@/components/CarouselStructure";

const PhotoPage = () => {
  const { photoId } = useParams();
  const { state, dispatch } = useContext(Context);
  const { photos } = state;

  useEffect(() => {
    const newCurrentPhoto = photos.find((p) => p.photoId === Number(photoId));
    if (newCurrentPhoto) {
      dispatch({ type: "SET_CURRENT_PHOTO", payload: newCurrentPhoto });
    }
  }, [photoId, photos, dispatch]);

  if (!state.currentPhoto) return <Loading />;

  return <CarouselStructure />;
};

export default PhotoPage;
