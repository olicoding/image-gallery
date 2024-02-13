import { Suspense } from "react";
import GalleryGrid from "@/server-components/GalleryGrid";

export default async function Home() {
  return (
    <Suspense>
      <GalleryGrid />;
    </Suspense>
  );
}
