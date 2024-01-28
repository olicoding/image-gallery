import { getProcessedImages } from "@/utils/imageService";

const FetchedImages = async ({ children }) => {
  const images = await getProcessedImages();
  return children(images);
};

export default FetchedImages;
