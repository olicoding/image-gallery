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
import { variants } from "src/utils/animationVariants";
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
        className="relative z-50 flex aspect-[3/2] w-full max-w-7xl items-center wide:h-full xl:taller-than-854:h-auto"
        {...handlers}
      >
        {/* Main image */}

        <div className="w-full overflow-hidden">
          <div className="relative flex aspect-[3/2] items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute"
              >
                <Image
                  src={`https://res.cloudinary.com/${
                    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                  }/image/upload/c_scale,${navigation ? "w_1280" : "w_1920"}/${
                    currentPhoto.public_id
                  }.${currentPhoto.format}`}
                  width={navigation ? 1280 : 1920}
                  height={navigation ? 853 : 1280}
                  priority
                  alt="Dynamic photo title"
                  onLoad={() => setLoaded(true)}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {loaded && (
            <div className="relative aspect-[3/2] max-h-full w-full">
              {navigation && (
                <>
                  {currentIndex > 0 && (
                    <button
                      className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(currentIndex - 1)}
                    >
                      <ChevronLeftIcon className="h-6 w-6" />
                    </button>
                  )}
                  {currentIndex + 1 < photos?.length && (
                    <button
                      className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                      style={{ transform: "translate3d(0, 0, 0)" }}
                      onClick={() => changePhotoId(currentIndex + 1)}
                    >
                      <ChevronRightIcon className="h-6 w-6" />
                    </button>
                  )}
                </>
              )}
              <div className="absolute right-0 top-0 flex items-center gap-2 p-3 text-white">
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
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute left-0 top-0 flex items-center gap-2 p-3 text-white">
                <button
                  onClick={() => closeModal()}
                  className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Photos Thumbnail View */}

          {navigation && (
            <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden bg-gradient-to-b from-black/0 to-black/60">
              <motion.div
                className="mx-auto mb-6 mt-6 flex aspect-[5/4] h-32 items-center"
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
                        currentIndex === index
                          ? "z-20 rounded-md shadow shadow-black/50"
                          : "z-10"
                      } relative inline-block  w-full shrink-0  overflow-hidden focus:outline-none`}
                    >
                      <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_180/${photo.public_id}.${photo.format}`}
                        alt="Thumbnail"
                        width={180}
                        height={120}
                        className={`${
                          currentIndex === index
                            ? "brightness-115 hover:brightness-110"
                            : "brightness-50 contrast-125"
                        } mx-1 transition hover:brightness-75`}
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
