"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import useKeypress from "react-use-keypress";
import CarouselElements from "./CarouselElements";
import { useContext } from "react";
import { Context } from "src/context/ContextProvider";

export default function CarouselStructure({ index, currentPhoto }) {
  console.log("In CarouselStructure, index: ", index);
  console.log("In CarouselStructure, currentPhoto: ", currentPhoto);

  const { setLastViewedPhoto } = useContext(Context);

  const router = useRouter();

  function closeModal() {
    setLastViewedPhoto(currentPhoto.photoId);
    router.push("/", undefined, { shallow: true });
  }

  function changePhotoId(newVal) {
    return newVal;
  }

  useKeypress("Escape", () => {
    closeModal();
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={currentPhoto.blurDataUrl}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority={true}
        />
      </button>
      <CarouselElements
        index={index}
        changePhotoId={changePhotoId}
        currentPhoto={currentPhoto}
        closeModal={closeModal}
        navigation={false}
      />
    </div>
  );
}
