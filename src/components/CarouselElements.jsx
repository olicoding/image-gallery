"use client";

import Image from "next/image";
import {
  ArrowDownTrayIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useContext, useState } from "react";
import { Context } from "src/context/ContextProvider";
import { useSwipeable } from "react-swipeable";
import downloadPhoto from "src/utils/downloadPhoto";
import Loading from "src/app/server-components/Loading";

export default function CarouselElements({ closeModal, navigation }) {
  const { state, dispatch } = useContext(Context);
  const { photos, currentPhoto } = state;
  const [loaded, setLoaded] = useState(false);
  const [direction, setDirection] = useState(0);

  const currentIndex = photos.findIndex(
    (photo) => photo.photoId === currentPhoto.photoId
  );

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  const changePhotoId = (newIndex) => {
    if (newIndex >= 0 && newIndex < photos.length) {
      dispatch({ type: "SET_CURRENT_PHOTO", payload: photos[newIndex] });

      setDirection(newIndex > currentIndex ? 1 : -1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => changePhotoId(currentIndex + 1),
    onSwipedRight: () => changePhotoId(currentIndex - 1),
    trackMouse: true,
  });

  if (!currentPhoto) return <Loading />;

  return (
    <MotionConfig
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
    >
      <div
        className="relative z-50 flex aspect-[3/2] h-full w-full max-w-7xl items-center xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main image */}

        <div
          className="relative w-full overflow-hidden "
          style={{ paddingTop: "100%" }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute left-0 top-0 h-full w-full"
            >
              <Image
                onLoad={() => setLoaded(true)}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_scale,w_1920/${currentPhoto.public_id}.${currentPhoto.format}`}
                alt={`Photo ${currentPhoto.photoId}`}
                className="object-cover object-center"
                fill
                sizes="100vw"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="md: absolute inset-0 mx-auto flex max-w-7xl items-center justify-between md:px-6 lg:px-14 shorter-than-1000:py-16">
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {currentIndex > 0 && (
                    <button
                      className="absolute left-2 top-[calc(50%-20px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none md:left-3 shorter-than-1000:top-[calc(50%-50px)]"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(currentIndex - 1)}
                    >
                      <ChevronLeftIcon className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  )}
                  {currentIndex + 1 < photos?.length && (
                    <button
                      className="absolute right-2 top-[calc(50%-20px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none md:right-3 shorter-than-1000:top-[calc(50%-50px)]"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(currentIndex + 1)}
                    >
                      <ChevronRightIcon className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute -top-16 right-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() =>
                    downloadPhoto(
                      `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentPhoto.public_id}.${currentPhoto.format}`,
                      `${currentIndex}.jpg`
                    )
                  }
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                  title="Download fullsize version"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
              <div className="absolute -top-16 left-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>
            </div>
          )}

          {/* Thumbnails */}

          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                className="mx-auto mb-12 mt-8 flex aspect-[5/2] h-16 items-center"
                initial={false}
              >
                <AnimatePresence initial={false}>
                  {photos.map((photo, index) => (
                    <motion.button
                      key={photo.photoId}
                      initial={{ width: "0%" }}
                      animate={{
                        scale: currentIndex === index ? 1.25 : 1,
                        width: "100%",
                        height: "100px",
                        x: `${currentIndex * -100}%`,
                      }}
                      exit={{ width: "0%" }}
                      onClick={() => changePhotoId(index)}
                      className={`${
                        currentIndex === index ? "z-20" : "z-10"
                      } relative inline-block  w-full shrink-0 overflow-hidden rounded-md  shadow shadow-black/50 focus:outline-none`}
                    >
                      <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_scale,w_150/${photo.public_id}.${photo.format}`}
                        alt="Thumbnail"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className={`${
                          currentIndex === index
                            ? "cursor-default brightness-100"
                            : "opacity-70 brightness-50 hover:brightness-100"
                        } absolute left-1/2 top-1/2 transform object-cover object-bottom`}
                      />
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  );
}
