import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import Modal from "../components/Modal";
import Star from "../components/icons/Star";
import cloudinary from "../utils/cloudinary";
import useOutsideClick from "../hooks/useOutsideClick";
import { useLastViewedPhoto } from "../utils/useLastViewedPhoto";
import getBase64ImageUrl from "../utils/generateBlurPlaceholder";

const Home = ({ images }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();
  const lastViewedPhotoRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    if (showDropdown) {
      setShowDropdown(false);
      setShowAdminLogin(false);
      setAdminPassword("");
      setLoginError("");
    }
  });

  const handleVisitorLogin = async () => {
    // set state as 'visitor' with limited access
    router.push("/admin");
  };

  const handleAdminLogin = async (e) => {
    // set state as 'admin' with full access
    e.preventDefault();
    setLoginError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const errorData = await response.json();
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error("Login error:", error.message);
      setLoginError("An error occurred during login.");
    }
  };

  useEffect(() => {
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: "center" });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  return (
    <>
      <Head>
        <title>Image Gallery | Home</title>
      </Head>
      <header className="flex justify-end bg-black p-4 text-white">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="hover:underline"
        >
          Dashboard
        </button>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-4 top-10 z-10 mt-2 w-48 bg-white py-2 shadow-lg"
          >
            <button
              onClick={handleVisitorLogin}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            >
              Visitor
            </button>
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="block w-full px-4 py-2 text-left text-black hover:bg-gray-100"
            >
              Admin
            </button>
            {showAdminLogin && (
              <form onSubmit={handleAdminLogin} className="p-4">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="mb-2 w-full border px-2 py-1 text-black"
                />
                <button
                  type="submit"
                  className="w-full bg-black px-4 py-2 text-white"
                >
                  Login
                </button>
                {loginError && (
                  <p className="mt-2 text-red-500">{loginError}</p>
                )}
              </form>
            )}
          </div>
        )}
      </header>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[250px] flex-col items-center justify-end gap-2 overflow-hidden rounded-lg bg-white/10 px-6 pb-10 pt-48 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-start justify-center pt-10 opacity-40">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Star />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-[230px] bg-gradient-to-b from-black/0 via-black to-black"></span>
            </div>

            <h1 className="mt-8 text-base font-bold uppercase tracking-widest">
              Photo Gallery
            </h1>
          </div>
          {images.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`/?photoId=${id}`}
              as={`/p/${id}`}
              scroll={false}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              shallow
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: "translate3d(0, 0, 0)" }}
                placeholder="blur"
                blurDataURL={blurDataUrl}
                unoptimized={true}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Photo Gallery{" "}
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await cloudinary.v2.search
    .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by("public_id", "desc")
    .max_results(400)
    .execute();
  let reducedResults = [];

  let i = 0;
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
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

  return {
    props: {
      images: reducedResults,
    },
  };
}
