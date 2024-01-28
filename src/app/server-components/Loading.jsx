export default function Loading() {
  return (
    <div
      className="grid h-full min-h-[100px] place-items-center"
      data-testid="loading"
      aria-live="polite"
    >
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-transparent" />
    </div>
  );
}
