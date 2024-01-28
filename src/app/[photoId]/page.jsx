"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CarouselStructure from "@/components/photos/CarouselStructure";
import getResults from "@/utils/cachedImages";

const PhotoPage = () => {
  const params = useParams();
  const photoId = params.photoId;
  const index = Number(photoId);
  const [currentPhoto, setCurrentPhoto] = useState(null);

  useEffect(() => {
    const loadImages = async () => {
      const results = await getResults();
      const images = results.resources;
      const photo = images.find((p) => p.photoId === index);
      setCurrentPhoto(photo);
    };

    loadImages();
  }, [photoId]);

  if (!currentPhoto) {
    return <div>Loading photo...</div>;
  }

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <CarouselStructure index={index} currentPhoto={currentPhoto} />
    </main>
  );
};

export default PhotoPage;
