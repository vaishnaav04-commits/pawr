export default function Loading() {
  return (
    <main
      id="main"
      aria-label="Loading Pawr"
      className="mx-auto max-w-5xl p-10"
    >
      <div className="h-10 w-60 animate-pulse rounded-xl bg-primary/10" />
      <div className="mt-8 h-72 animate-pulse rounded-3xl bg-primary/10" />
      <p role="status" className="mt-4 text-sm text-muted">
        Gathering your little world…
      </p>
    </main>
  );
}
