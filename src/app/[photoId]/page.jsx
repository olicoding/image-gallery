"use client";

import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Context } from "@/context/ContextProvider";
import CarouselStructure from "@/components/photos/CarouselStructure";

const PhotoPage = () => {
  const { photoId } = useParams();
  const { photos } = useContext(Context);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    const photo = photos.find((p) => p.photoId === Number(photoId));
    setCurrentPhoto(photo);
  }, [photoId, photos]);

  if (!currentPhoto) {
    return <div className="text-white">Loading photo...</div>;
  }

  return (
    <CarouselStructure index={Number(photoId)} currentPhoto={currentPhoto} />
  );
};

export default PhotoPage;
