"use client";

import { useCallback, useContext, useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Context } from "@/context/ContextProvider";
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
  const { currentDirectory, allDirectories } = state;
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragStarted, setDragStarted] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [interactionType, setInteractionType] = useState("click");

  const currentFolderImages = allDirectories[currentDirectory] || [];

  const activateDrag = {
    delay: 300,
    tolerance: 10,
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: activateDrag,
    }),
    useSensor(TouchSensor, {
      activationConstraint: activateDrag,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const photoMap = useMemo(() => {
    return currentFolderImages.reduce((map, photo) => {
      map[photo.photoId] = photo;
      return map;
    }, {});
  }, [currentFolderImages]);

  const onDragStart = useCallback(
    (event) => {
      const item = photoMap[event.active.id];
      if (item) {
        setDraggedItem(item);
        setIsDragging(true);
      }
    },
    [photoMap]
  );
  // const onDragStart = useCallback(
  //   (e) => {
  //     const item = currentFolderImages.find(
  //       (photo) => photo.photoId === e.active.id
  //     );
  //     if (item) setDraggedItem(item);
  //   },
  //   [currentFolderImages]
  // );

  const onDragOver = useCallback(
    ({ active, over }) => {
      if (over && active.id !== over.id) {
        const oldIndex = currentFolderImages.findIndex(
          (photo) => photo.photoId === active.id
        );
        const newIndex = currentFolderImages.findIndex(
          (photo) => photo.photoId === over.id
        );
        const updatedPhotos = arrayMove(
          currentFolderImages,
          oldIndex,
          newIndex
        );

        dispatch({
          type: "UPDATE_IMAGE_ORDER_IN_FOLDER",
          payload: {
            currentDirectory,
            updatedPhotos,
          },
        });
      }
    },
    [currentFolderImages, dispatch, currentDirectory]
  );

  const onDragEnd = useCallback(() => {
    setDraggedItem(null);
    setIsDragging(false);
    setTimeout(() => setInteractionType("click"), 0);
  }, []);

  const handlePhotoClick = (photoId) => {
    if (interactionType === "click") {
      router.push(`/album/${currentDirectory}/${photoId}`);
      dispatch({ type: "SET_VIEW_MODE", payload: "carousel" });
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragStarted(Date.now());
  };

  const handleMouseDown = () => {
    setDragStarted(Date.now());
  };

  const handleMouseUp = (photoId) => {
    const interactionDuration = Date.now() - dragStarted;
    if (interactionDuration < 200) {
      handlePhotoClick(photoId);
    }
    setDragStarted(null);
  };

  const photoIds = useMemo(
    () => currentFolderImages.map((photo) => photo.photoId),
    [currentFolderImages]
  );

  return (
    <div className={isDragging ? "dragging" : ""}>
      <DndContext
        collisionDetection={closestCenter}
        onDragStart={(e) => onDragStart(e)}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        sensors={sensors}
        id={id}
      >
        <SortableContext items={photoIds} strategy={rectSortingStrategy}>
          {currentFolderImages.map((photo) => (
            <div
              key={photo.public_id}
              onMouseDown={(e) => handleMouseDown(e)}
              onTouchStart={(e) => handleTouchStart(e)}
              onMouseUp={() => handleMouseUp(photo.photoId)}
            >
              <SortablePhoto photo={photo} />
              {draggedItem && (
                <DragOverlay>
                  <motion.div
                    initial={{
                      opacity: 0,
                      scale: 1.05,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SortablePhoto isDraggable={true} photo={draggedItem} />
                  </motion.div>
                </DragOverlay>
              )}
            </div>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default GalleryDesktop;
