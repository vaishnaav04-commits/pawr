"use client";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="mx-auto max-w-lg p-10 text-center">
      <h1 className="text-3xl font-semibold">A little bump in the path.</h1>
      <p className="my-6 text-muted">
        We couldn’t load this page. Try again. If it continues, check your
        Supabase configuration and migrations.
      </p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
