"use client";

import React, { useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { Context } from "@/context/ContextProvider";

const Loading = React.lazy(() => import("../server-components/Loading"));
const CarouselStructure = React.lazy(() =>
  import("@/components/CarouselStructure")
);

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
