"use client";

import { isMobile } from "react-device-detect";
import GalleryDesktop from "./GalleryDesktop";
import GalleryMobile from "./GalleryMobile";

export default function GalleryPerDevice() {
  return <>{isMobile ? <GalleryMobile /> : <GalleryDesktop />}</>;
}
