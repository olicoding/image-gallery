"use client";

import { useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { Context } from "@/context/ContextProvider";
import Loading from "@/server-components/Loading";
import CarouselStructure from "@/components/CarouselStructure";

const PhotoPage = () => {
  const { album, photoId } = useParams();
  const { state, dispatch } = useContext(Context);
  const { allDirectories, currentDirectory } = state;

  useEffect(() => {
    let newCurrentPhoto = null;
    const directoryPhotos = allDirectories[currentDirectory];

    if (directoryPhotos) {
      newCurrentPhoto = directoryPhotos.find((p) => p.photoId === photoId);
    }

    if (newCurrentPhoto) {
      dispatch({ type: "SET_CURRENT_PHOTO", payload: newCurrentPhoto });

      if (currentDirectory !== album)
        dispatch({ type: "SET_CURRENT_DIRECTORY", payload: album });
    } else {
      console.error(
        "Photo not found in the directory",
        currentDirectory,
        photoId
      );
    }
  }, [album, photoId, allDirectories, currentDirectory, dispatch]);

  if (!state.currentPhoto) return <Loading />;

  return <CarouselStructure />;
};

export default PhotoPage;
