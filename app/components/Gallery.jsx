"use client";

import Star from "./icons/Star";

// what was being used in the index.jsx file from the pages directory,should be set here working with the new app system.

const Gallery = () => {
  return (
    <main className="mx-auto max-w-[1960px] p-4">
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
      </div>
    </main>
  );
};

export default Gallery;
