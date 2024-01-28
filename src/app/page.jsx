import { fetchImages } from "@/utils/fetchImages";
import GalleryGrid from "@/components/photos/GalleryGrid";

export default async function Home() {
  const { images } = await fetchImages();

  return <GalleryGrid images={images} />;
}
