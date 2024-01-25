const cache = new Map();

export async function getBase64ImageUrl(image) {
  let url = cache.get(image);
  if (url) {
    return url;
  }
  const imageUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_10/${image.public_id}.${image.format}`;
  const response = await fetch(imageUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  url = `data:image/jpeg;base64,${base64}`;
  cache.set(image, url);
  return url;
}

// import imagemin from "imagemin";
// import imageminJpegtran from "imagemin-jpegtran";

// const cache = new Map();

// export default async function getBase64ImageUrl(image) {
// let url = cache.get(image);
// if (url) {
//   return url;
// }
//   const response = await fetch(
//     `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_jpg,w_8,q_70/${image.public_id}.${image.format}`
//   );
//   const buffer = await response.arrayBuffer();
//   const minified = await imagemin.buffer(Buffer.from(buffer), {
//     plugins: [imageminJpegtran()],
//   });

//   url = `data:image/jpeg;base64,${Buffer.from(minified).toString("base64")}`;
// cache.set(image, url);
// return url;
// }
