"use client";

import { useEffect, useRef, useContext, useState, useId } from "react";
import { Context } from "src/context/ContextProvider";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Star from "src/app/server-components/Star";
import PhotoViewer from "@/components/PhotoViewer";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

const draggableImageStyle = (transform, transition) => ({
  transform: CSS.Transform.toString(transform),
  transition,
  touchAction: "none",
});

const SortablePhotos = ({ photo, isHovered }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: photo.photoId });

  const style = {
    ...draggableImageStyle(transform, transition),
    boxShadow: isHovered ? "0 0 0 2px white" : "none",
  };

  return (
    <Image
      alt="Dynamic photo title"
      className="group relative mb-5 block w-full transform cursor-move rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      placeholder="blur"
      blurDataURL={photo.blurDataUrl}
      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${photo.public_id}.${photo.format}`}
      width={photo.width}
      height={photo.height}
      sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
    />
  );
};

export default function GalleryGrid() {
  const id = useId();
  const { photoId } = useParams();
  const lastViewedPhotoRef = useRef(null);
  const { state, dispatch } = useContext(Context);
  const { photos, lastViewedPhoto } = state;
  const [draggedItem, setDraggedItem] = useState(null);
  const [hoveredPhotoId, setHoveredPhotoId] = useState(null);
  const [dragOverlayStyles, setDragOverlayStyles] = useState({
    transform: null,
    transition: "transform 500ms ease",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const onDragStart = (event) => {
    const { active } = event;
    const item = photos.find((photo) => photo.photoId === active.id);
    setDraggedItem(item);
  };

  const onDragMove = (event) => {
    const { delta, over } = event;
    if (draggedItem && delta) {
      const newTransform = {
        x: (dragOverlayStyles.transform?.x || 0) + delta.x,
        y: (dragOverlayStyles.transform?.y || 0) + delta.y,
      };
      setDragOverlayStyles({
        ...dragOverlayStyles,
        transform: CSS.Transform.toString(newTransform),
      });
    }
    setHoveredPhotoId(over?.id);
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = photos.findIndex((photo) => photo.photoId === active.id);
      const newIndex = photos.findIndex((photo) => photo.photoId === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newPhotosArray = arrayMove(photos, oldIndex, newIndex);
        dispatch({ type: "SET_PHOTOS", payload: newPhotosArray });
      }
    }
    setDragOverlayStyles({
      transform: null,
      transition: "transform 500ms ease",
    });
    setHoveredPhotoId(null);
    setDraggedItem(null);
  };

  useEffect(() => {
    if (lastViewedPhoto && !photoId && lastViewedPhotoRef.current) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      dispatch({ type: "SET_LAST_VIEWED_PHOTO", payload: null });
    }
  }, [lastViewedPhoto, photoId, dispatch]);

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      {photoId && (
        <PhotoViewer
          images={photos}
          onClose={() => {
            dispatch({ type: "SET_LAST_VIEWED_PHOTO", payload: photoId });
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
        <DndContext
          collisionDetection={closestCenter}
          onDragStart={onDragStart}
          onDragMove={onDragMove}
          onDragEnd={onDragEnd}
          sensors={sensors}
          id={id}
        >
          <SortableContext items={photos} strategy={rectSortingStrategy}>
            {photos &&
              photos.map((photo) => (
                <Link
                  href={`/${photo.photoId}`}
                  key={photo.photoId}
                  ref={
                    photo.photoId === Number(lastViewedPhoto)
                      ? lastViewedPhotoRef
                      : null
                  }
                  scroll={false}
                  shallow
                >
                  <SortablePhotos
                    key={photo.photoId}
                    photo={photo}
                    isHovered={hoveredPhotoId === photo.photoId}
                  ></SortablePhotos>
                </Link>
              ))}
          </SortableContext>
          <DragOverlay>
            {draggedItem ? (
              <Image
                alt={`Dragging ${draggedItem.alt}`}
                blurDataURL={draggedItem.blurDataUrl}
                src={draggedItem.blurDataUrl}
                width={draggedItem.width}
                height={draggedItem.height}
                placeholder="blur"
                className="rounded-lg border border-2 border-solid border-white"
                style={dragOverlayStyles}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </main>
  );
}
