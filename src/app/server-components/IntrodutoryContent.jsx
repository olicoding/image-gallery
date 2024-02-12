import Star from "@/server-components/svg/Star";

export default function IntroductoryContent() {
  return (
    <div className="after:content relative mb-2 flex h-[150px] flex-col items-center justify-end gap-1 overflow-hidden rounded-lg bg-white/10 px-2 pb-4 pt-32 text-center text-white shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
      <div className="absolute inset-0 flex items-start justify-center pt-4 opacity-40">
        <span className="flex max-h-full max-w-full items-center justify-center">
          <Star />
        </span>
        <span className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-b from-black/0 via-black to-black"></span>
      </div>
      <h1 className="text-sm font-bold uppercase">
        Interactive Features Available
      </h1>
    </div>
  );
}
