// import env from "./env";
// import { ImagesSchemaWithPhotos } from "@/models/Images";
import { getBase64ImageUrl } from "@/utils/generateBlurPlaceholder";
import cloudinary from "@/utils/cloudinary";

export async function fetchImages() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();

  let reducedResults = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      photoId: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return { images: reducedResults };
}
