"use client";

import { useContext } from "react";
import { Context } from "src/context/ContextProvider";
import Image from "next/image";
import Link from "next/link";

const GalleryMobile = () => {
  const { state } = useContext(Context);

  return (
    <>
      {state.photos &&
        state.photos.map(({ photoId, public_id, format, blurDataUrl }) => (
          <Link
            key={photoId}
            href={`/${photoId}`}
            scroll={false}
            shallow
            className="after:content group relative mb-2 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
          >
            <Image
              alt={`Photo ${photoId}`}
              className="rounded-lg brightness-90 group-hover:brightness-110"
              style={{ transform: "translate3d(0, 0, 0)" }}
              placeholder="blur"
              blurDataURL={blurDataUrl}
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_scale,w_720/${public_id}.${format}`}
              width={720}
              height={480}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          </Link>
        ))}
    </>
  );
};

export default GalleryMobile;
