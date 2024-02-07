const cache = new Map();

export async function getBase64ImageUrl(image) {
  let url = cache.get(image);
  if (url) {
    return url;
  }
  const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_30/${image.public_id}.${image.format}`;
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  url = `data:image/jpeg;base64,${base64}`;
  cache.set(image, url);
  return url;
}
