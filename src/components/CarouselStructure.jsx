"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Suspense, useContext } from "react";
import useKeypress from "react-use-keypress";
import { Context } from "src/context/ContextProvider";
import Loading from "src/app/server-components/Loading";

const CarouselElements = React.lazy(() => import("./CarouselElements"));

export default function CarouselStructure() {
  const { state, dispatch } = useContext(Context);
  const { photos, currentPhoto } = state;
  const router = useRouter();

  function closeModal() {
    router.push("/", undefined, { shallow: true });
    dispatch({ type: "SET_CURRENT_PHOTO", payload: null });
  }

  useKeypress("Escape", closeModal);

  if (!currentPhoto) return <Loading />;

  const index = photos.findIndex(
    (photo) => photo.photoId === currentPhoto.photoId
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <button
        className="absolute inset-0 z-30 cursor-default bg-black backdrop-blur-2xl"
        onClick={closeModal}
      >
        <Image
          src={currentPhoto?.blurDataUrl}
          className="pointer-events-none h-full w-full"
          alt="blurred background"
          fill
          priority
        />
      </button>
      <Suspense fallback={<Loading />}>
        <CarouselElements
          index={index}
          currentPhoto={currentPhoto}
          closeModal={closeModal}
          navigation={true}
        />
      </Suspense>
    </div>
  );
}
