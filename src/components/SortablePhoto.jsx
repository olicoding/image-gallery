"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";

const SortablePhoto = memo(({ photo }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: photo.photoId });

  const motionStyle = useMemo(
    () => ({
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
      opacity: isDragging ? 0.5 : 1,
      transition: { type: "spring", stiffness: 100, damping: 25, mass: 3 },
    }),
    [transform, isDragging]
  );

  return (
    <motion.div
      className="relative mb-2 h-full w-full"
      style={{
        paddingBottom: `${(photo.height / photo.width) * 100}%`,
        ...motionStyle,
      }}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      <Image
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,c_fill,w_300/${photo.public_id}.${photo.format}`}
        alt={`Photo ${photo.photoId}`}
        className="absolute inset-0 h-full w-full cursor-move rounded-lg object-cover brightness-90 will-change-transform hover:brightness-110"
        placeholder="blur"
        blurDataURL={photo.blurDataUrl}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
        fill
      />
    </motion.div>
  );
});

export default SortablePhoto;
