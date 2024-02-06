import IntroductoryContent from "src/app/server-components/IntrodutoryContent";
import GalleryPerDevice from "../../components/GalleryPerDevice";

export default function GalleryGrid() {
  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="columns-3 gap-2 sm:columns-4 xl:columns-5 2xl:columns-6">
          <IntroductoryContent />
          <GalleryPerDevice />
        </div>
      </main>
    </>
  );
}
