"use client";

import { useContext, useState, useId, useCallback, memo, useMemo } from "react";
import { Context } from "src/context/ContextProvider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Star from "src/app/server-components/Star";
import { isMobile } from "react-device-detect";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";

const SortablePhoto = memo(({ photo }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({ id: photo.photoId });

  const motionStyle = useMemo(
    () => ({
      x: transform?.x ?? 0,
      y: transform?.y ?? 0,
      opacity: isDragging ? 0.5 : 1,
      transition: { type: "spring", stiffness: 600, damping: 30 },
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
        alt={`Photo ${photo.photoId}`}
        className="absolute inset-0 h-full w-full cursor-move rounded-lg object-cover brightness-90 hover:brightness-110"
        placeholder="blur"
        blurDataURL={photo.blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${photo.public_id}.${photo.format}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
        draggable={!isMobile}
      />
    </motion.div>
  );
});

export default function GalleryGrid() {
  const router = useRouter();
  const id = useId();
  const { state, dispatch } = useContext(Context);
  const [draggedItem, setDraggedItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 10,
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const onDragStart = useCallback(
    (event) => {
      const item = state.photos.find(
        (photo) => photo.photoId === event.active.id
      );
      if (item) setDraggedItem(item);
    },
    [state.photos]
  );

  const onDragOver = useCallback(
    ({ active, over }) => {
      if (over && active.id !== over.id) {
        const oldIndex = state.photos.findIndex(
          (photo) => photo.photoId === active.id
        );
        const newIndex = state.photos.findIndex(
          (photo) => photo.photoId === over.id
        );
        const updatedPhotos = arrayMove(state.photos, oldIndex, newIndex);

        dispatch({
          // type: "TEMP_UPDATE_PHOTOS",
          type: "SET_PHOTOS",
          payload: updatedPhotos,
        });
      }
    },
    [state.photos, dispatch]
  );

  const onDragEnd = useCallback(() => {
    setDraggedItem(null);
  }, []);

  const photoIds = useMemo(
    () => state.photos.map((photo) => photo.photoId),
    [state.photos]
  );

  const handlePhotoClick = (event, photoId) => {
    if (draggedItem) {
      event.preventDefault();
      event.stopPropagation();
      return;
    } else {
      router.push(`/${photoId}`);
    }
  };

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <div className="columns-3 gap-2 sm:columns-4 xl:columns-5 2xl:columns-6">
        <div className="after:content relative mb-2 flex h-[150px] flex-col items-center justify-end gap-1 overflow-hidden rounded-lg bg-white/10 px-2 pb-4 pt-32 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
          <div className="absolute inset-0 flex items-start justify-center pt-4 opacity-40">
            <span className="flex max-h-full max-w-full items-center justify-center">
              <Star />
            </span>
            <span className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-b from-black/0 via-black to-black"></span>
          </div>
          <h1 className="text-sm font-bold uppercase">
            {isMobile ? "Carousel Mode onClick" : "Drag'n Drop and Carousel"}
          </h1>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDragEnd={onDragEnd}
          sensors={sensors}
          id={id}
        >
          <SortableContext items={photoIds} strategy={rectSortingStrategy}>
            {state.photos.map((photo) => (
              <div
                key={photo.photoId}
                onClick={(e) => handlePhotoClick(e, photo.photoId)}
              >
                <SortablePhoto photo={photo} />
              </div>
            ))}
          </SortableContext>
          <DragOverlay>
            {draggedItem && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                <SortablePhoto photo={draggedItem} />
              </motion.div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
