import IntroductoryContent from "src/app/server-components/IntrodutoryContent";
import GalleryDesktop from "../../components/GalleryDesktop";

export default function GalleryGrid() {
  return (
    <>
      <main className="mx-auto max-w-[1960px] p-4">
        <div className="columns-3 gap-2 sm:columns-4 xl:columns-5 2xl:columns-6">
          <IntroductoryContent />
          <GalleryDesktop />
        </div>
      </main>
    </>
  );
}
