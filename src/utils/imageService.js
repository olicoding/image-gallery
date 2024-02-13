import cloudinary from "./cloudinary";
import { getBase64ImageUrl } from "./generateBlurPlaceholder";

let cachedImages = {};

export const getProcessedImages = async () => {
  if (Object.keys(cachedImages).length > 0) return cachedImages;

  const { folders } = await cloudinary.v2.api.root_folders();
  const processedFolders = await Promise.all(
    folders.map((folder) => processFolder(folder))
  );

  const foldersObject = processedFolders.reduce(
    (acc, folder) => ({ ...acc, ...folder }),
    {}
  );
  cachedImages = foldersObject;
  return foldersObject;
};

const processFolder = async (folder) => {
  let folderImages = await fetchAndProcessImages(folder.path);

  const subfoldersResponse = await cloudinary.v2.api.sub_folders(folder.path);
  const subfolderImagesPromises = subfoldersResponse.folders.map((subfolder) =>
    fetchAndProcessImages(`${folder.path}/${subfolder.name}`)
  );
  const subfolderImagesResults = await Promise.all(subfolderImagesPromises);

  subfolderImagesResults.forEach((subfolderImages) => {
    folderImages = [...folderImages, ...subfolderImages];
  });

  return { [folder.name]: folderImages };
};

const fetchAndProcessImages = async (path) => {
  const results = await cloudinary.v2.search
    .expression(`folder:${path}/*`)
    .sort_by("public_id", "desc")
    .max_results(100)
    .execute();

  const processedImages = await Promise.all(
    results.resources.map(async (image) => {
      const photoId = image.public_id.split("/").pop();

      return {
        photoId,
        height: image.height,
        width: image.width,
        public_id: image.public_id,
        format: image.format,
        blurDataUrl: await getBase64ImageUrl(image),
      };
    })
  );

  return processedImages;
};
