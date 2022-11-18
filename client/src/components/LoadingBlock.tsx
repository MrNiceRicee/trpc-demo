function LoadingBlock({ text }: { text: string }) {
  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-md bg-stone-200 p-1">
      <div
        className="animate-spin-slow absolute inset-0 top-1/4 left-1/2 h-1/2 w-3/4
    origin-left -translate-y-1/2
    -translate-x-1/2 rounded-full
    bg-sky-700 mix-blend-color-burn
  "
        aria-hidden="true"
        aria-label="Loading"
      />
      <div className=" z-10 flex h-full w-full items-center justify-center rounded-sm bg-stone-100">
        <h2 className="text-2xl">{text}</h2>
      </div>
    </div>
  );
}

export default LoadingBlock;
