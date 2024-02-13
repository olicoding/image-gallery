const cache = new Map();

export async function getBase64ImageUrl(image) {
  const cacheKey = `${image.public_id}.${image.format}`;
  let url = cache.get(cacheKey);
  if (url) return url;

  try {
    const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_30/${cacheKey}`;
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = `image/${image.format === "jpg" ? "jpeg" : image.format}`;
    url = `data:${mimeType};base64,${base64}`;

    cache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error(`Error generating blur placeholder for ${cacheKey}:`, error);
    return "";
  }
}
