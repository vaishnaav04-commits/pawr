import { Brand } from "@/components/brand";
import { AuthForm } from "@/components/auth-form";
import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;
  return (
    <main id="main" className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-16">
        <Brand />
        <div className="m-auto w-full max-w-md py-16">
          <p className="eyebrow">One app. Every paw.</p>
          <h1 className="mt-4 text-4xl font-semibold">A fresh start.</h1>
          <p className="mt-4 leading-7 text-muted">
            Choose a new password for your account.
          </p>
          {message && (
            <p
              role="status"
              className="mt-5 rounded-xl bg-amber-50 p-3 text-sm"
            >
              {message}
            </p>
          )}
          <AuthForm mode="update" />
          <p className="mt-7 text-center text-sm text-muted">
            New to Pawr?{" "}
            <Link href="/signup" className="font-semibold text-primary">
              Join us
            </Link>
          </p>
          <Link
            href="/demo"
            className="mt-5 block text-center text-sm text-primary"
          >
            Explore the demo →
          </Link>
        </div>
      </div>
      <div className="relative hidden bg-primary lg:block">
        <img
          src="/images/dog.jpg"
          alt="A fluffy dog enjoying an outdoor adventure"
          className="photo absolute"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute bottom-20 left-14 right-14 text-white">
          <h2 className="text-5xl font-semibold">
            For the love
            <br />
            of every little paw.
          </h2>
          <p className="mt-5 text-white/80">One App. Every Paw. Everything.</p>
        </div>
      </div>
    </main>
  );
}
