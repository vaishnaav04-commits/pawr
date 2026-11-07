import Link from "next/link";
import {
  LayoutGrid,
  PawPrint,
  UserRound,
  ArrowUpRight,
  Heart,
  LogOut,
} from "lucide-react";
import { Brand } from "./brand";
import { logout } from "@/app/auth/actions";
export function WorkspaceShell({
  children,
  demo = false,
}: {
  children: React.ReactNode;
  demo?: boolean;
}) {
  return (
    <div className="min-h-screen md:pl-60">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col border-r border-primary/10 bg-[#f5f5ed] px-7 py-9 md:flex">
        <Brand />
        <p className="eyebrow mb-4 mt-14">Your little world</p>
        <nav aria-label="Workspace" className="space-y-2">
          {[
            ["Dashboard", demo ? "/demo" : "/dashboard", LayoutGrid],
            ["Pawr ID", demo ? "/demo#pets" : "/pets", PawPrint],
            ["Your profile", demo ? "/signup" : "/profile", UserRound],
          ].map(([label, href, Icon]) => {
            const I = Icon as typeof PawPrint;
            return (
              <Link
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-primary/10"
                href={href as string}
                key={label as string}
              >
                <I size={19} />
                {label as string}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#e5ebdd] p-5">
          <Heart size={21} className="text-primary" />
          <p className="mt-3 text-sm font-semibold">A little more together.</p>
          <p className="mt-2 text-xs leading-5 text-muted">
            Their whole world starts with you.
          </p>
        </div>
        {demo ? (
          <Link href="/signup" className="mt-5 flex gap-2 text-sm">
            Create an account <ArrowUpRight size={16} />
          </Link>
        ) : (
          <form action={logout}>
            <button className="mt-6 flex gap-2 text-sm">
              <LogOut size={16} /> Log out
            </button>
          </form>
        )}
      </aside>
      <header className="flex items-center justify-between border-b border-primary/10 bg-white/50 px-6 py-5 lg:px-10">
        <p className="text-sm text-muted">
          A happy place for you & yours{" "}
          <span className="ml-1 text-accent">✳</span>
        </p>
        <Link
          href={demo ? "/signup" : "/profile"}
          className="rounded-full bg-[#e5ebdd] px-4 py-2 text-xs font-semibold"
        >
          {demo ? "Demo explorer" : "My account"}
        </Link>
      </header>
      <nav
        aria-label="Mobile workspace"
        className="flex gap-6 border-b border-primary/10 px-6 py-4 text-sm md:hidden"
      >
        <Link href={demo ? "/demo" : "/dashboard"}>Home</Link>
        <Link href={demo ? "/demo#pets" : "/pets"}>Pawr ID</Link>
        <Link href={demo ? "/signup" : "/profile"}>Profile</Link>
        {!demo && (
          <form action={logout}>
            <button>Log out</button>
          </form>
        )}
      </nav>
      <main id="main" className="mx-auto max-w-7xl p-6 lg:p-10">
        {demo && (
          <div className="mb-6 rounded-xl border border-accent/30 bg-[#fbefe4] px-4 py-3 text-xs leading-5">
            You’re in the demo garden. All pets and activity shown here are
            fictional.{" "}
            <Link href="/signup" className="font-semibold underline">
              Create an account
            </Link>{" "}
            to add your own pets.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
