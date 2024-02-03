"use client";

import { Dialog } from "@headlessui/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import SharedModal from "./CarouselElements";

export default function PhotoViewer({ images, onClose }) {
  let overlayRef = useRef();

  function handleClose() {
    router.push("/", undefined, { shallow: true });
    onClose();
  }

  return (
    <Dialog
      static
      open={true}
      onClose={handleClose}
      initialFocus={overlayRef}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <Dialog.Overlay
        ref={overlayRef}
        as={motion.div}
        key="backdrop"
        className="fixed inset-0 z-30 bg-black/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      <SharedModal images={images} closeModal={handleClose} navigation={true} />
    </Dialog>
  );
}
