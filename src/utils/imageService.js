import cloudinary from "./cloudinary";
import { getBase64ImageUrl } from "./generateBlurPlaceholder";

let cachedImages = null;

export const getProcessedImages = async () => {
  if (cachedImages) {
    return cachedImages;
  }

  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  const reducedResults = results.resources.map((result, index) => ({
    photoId: index,
    height: result.height,
    width: result.width,
    public_id: result.public_id,
    format: result.format,
  }));

  const imagesWithBlurs = await Promise.all(
    reducedResults.map(async (image) => ({
      ...image,
      blurDataUrl: await getBase64ImageUrl(image),
    }))
  );

  cachedImages = imagesWithBlurs;
  return imagesWithBlurs;
};
