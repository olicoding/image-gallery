"use client";

import { useContext, useState, useId, useCallback, memo, useMemo } from "react";
import { Context } from "src/context/ContextProvider";
import Image from "next/image";
import Link from "next/link";
import Star from "src/app/server-components/Star";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
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

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition: isDragging ? "transform 500ms ease" : undefined,
      touchAction: isDragging ? "none" : "manipulation",
      opacity: isDragging ? 0.5 : 1,
    }),
    [transform, isDragging]
  );

  const sizes =
    "(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw";

  return (
    <div
      className="relative mb-2 w-full"
      style={{ paddingBottom: `${(photo.height / photo.width) * 100}%` }}
    >
      <Image
        alt={`Photo ${photo.photoId}`}
        className={`absolute inset-0 h-full w-full cursor-move rounded-lg object-cover brightness-90 will-change-transform hover:brightness-110`}
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        placeholder="blur"
        blurDataURL={photo.blurDataUrl}
        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${photo.public_id}.${photo.format}`}
        fill
        sizes={sizes}
      />
    </div>
  );
});

export default function GalleryGrid() {
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

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = state.photos.findIndex(
          (photo) => photo.photoId === active.id
        );
        const newIndex = state.photos.findIndex(
          (photo) => photo.photoId === over.id
        );
        dispatch({
          type: "SET_PHOTOS",
          payload: arrayMove(state.photos, oldIndex, newIndex),
        });
      }
      setDraggedItem(null);
    },
    [state.photos, dispatch]
  );

  const photoIds = useMemo(
    () => state.photos.map((photo) => photo.photoId),
    [state.photos]
  );

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
            Drag'n Drop and Carousel
          </h1>
        </div>
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          sensors={sensors}
          id={id}
        >
          <SortableContext items={photoIds} strategy={rectSortingStrategy}>
            {state.photos.map((photo) => (
              <div
                key={photo.photoId}
                onClick={(e) => draggedItem ?? e.preventDefault()}
              >
                <Link href={`/${photo.photoId}`} scroll={false} shallow>
                  <SortablePhoto photo={photo} />
                </Link>
              </div>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </main>
  );
}
