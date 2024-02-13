import { getProcessedImages } from "@/utils/imageService";

export default async function FetchedImages({ children }) {
  const images = await getProcessedImages();
  return children({ images });
}
