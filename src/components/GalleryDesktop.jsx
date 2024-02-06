"use client";

import {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import { Context } from "src/context/ContextProvider";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  useSensors,
  useSensor,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import SortablePhoto from "./SortablePhoto";

const GalleryDesktop = () => {
  const router = useRouter();
  const id = useId();
  const { state, dispatch } = useContext(Context);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isDraggable, setIsDraggable] = useState(!isMobile);

  useEffect(() => {
    setIsDraggable(isMobile);
  }, [isMobile]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 100,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstrain: {
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

  const handlePhotoClick = (event, photoId) => {
    if (draggedItem) {
      event.preventDefault();
      event.stopPropagation();
      return;
    } else {
      router.push(`/${photoId}`);
    }
  };

  const photoIds = useMemo(
    () => state.photos.map((photo) => photo.photoId),
    [state.photos]
  );

  return (
    <>
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
              <SortablePhoto isDraggable={isDraggable} photo={draggedItem} />
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default GalleryDesktop;
