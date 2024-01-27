"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Star from "src/components/icons/Star";
import { useEffect, useRef } from "react";
import Modal from "@/components/gallery/Modal";
import { useLastViewedPhoto } from "src/utils/useLastViewedPhoto";

export default function Gallery({ images }) {
  const params = useParams();
  const photoId = params.photoId;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef(null);

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      {photoId && (
        <Modal
          images={images}
          onClose={() => {
            setLastViewedPhoto(photoId);
          }}
        />
      )}
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
        <div className="after:content relative mb-5 flex h-[250px] flex-col items-center justify-end gap-2 overflow-hidden rounded-lg bg-white/10 px-6 pb-10 pt-48 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
          <div className="absolute inset-0 flex items-start justify-center pt-10 opacity-40">
            <span className="flex max-h-full max-w-full items-center justify-center">
              <Star />
            </span>
            <span className="absolute bottom-0 left-0 right-0 h-[230px] bg-gradient-to-b from-black/0 via-black to-black"></span>
          </div>

          <h1 className="mt-8 text-base font-bold uppercase tracking-widest">
            Photo Gallery
          </h1>
        </div>
        {images &&
          images.map(({ photoId, public_id, format, blurDataUrl }) => (
            <Link
              key={photoId}
              href={`/gallery/photo/${photoId}`}
              // href={`/gallery/photo?photoId=${photoId}`}
              // as={`/gallery/photo/${photoId}`}
              scroll={false}
              ref={
                photoId === Number(lastViewedPhoto) ? lastViewedPhotoRef : null
              }
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                unoptimized={true}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
      </div>
    </main>
  );
}
