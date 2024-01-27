"use client";
import Carousel from "@/components/gallery/Carousel";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGlobalState } from "src/utils/globalState";

export default function PhotoPage() {
  const params = useParams();
  const photoId = params.photoId;
  const [photos] = useGlobalState("photos");
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    if (photoId && photos.length > 0) {
      const photo = photos.find((p) => p.photoId === Number(photoId));
      setCurrentPhoto(photo);
    }
  }, [photoId, photos]);

  if (!currentPhoto) {
    return <div>No photo found</div>;
  }

  return <Carousel index={Number(photoId)} currentPhoto={currentPhoto} />;
}
