import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
  PawPrint,
  Stethoscope,
  Scissors,
  ShoppingBag,
  House,
  Users,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { modules } from "@/lib/demo";
const icons = [Heart, Stethoscope, Scissors, ShoppingBag, House, Users];
export default function Landing() {
  return (
    <>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7 lg:px-12">
        <Brand />
        <nav
          aria-label="Main"
          className="hidden items-center gap-9 text-sm md:flex"
        >
          <a href="#world">The Pawr world</a>
          <a href="#identity">Pawr ID</a>
          <Link href="/about">Our story</Link>
        </nav>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-semibold">
            Log in
          </Link>
          <ButtonLink href="/signup" className="hidden sm:inline-flex">
            Join the pack <ArrowUpRight size={16} />
          </ButtonLink>
        </div>
      </header>
      <main id="main" className="overflow-hidden">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-2 lg:px-12 lg:pb-28 lg:pt-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-[#edf1e7] px-4 py-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-primary" /> A whole world
              of wagging possibilities
            </span>
            <h1 className="mt-7 text-6xl font-semibold leading-[1.06] sm:text-7xl lg:text-[86px]">
              Their whole world.
              <br />
              <span className="font-serif italic font-normal text-primary">
                In your hands.
              </span>
            </h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-muted">
              From the first hello to a lifetime of happy paws. Bring every part
              of your pet’s life together, in one loving place.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/signup">
                Find your happy place <ArrowRight size={17} />
              </ButtonLink>
              <ButtonLink
                href="/demo"
                className="border border-primary/20 bg-transparent text-primary hover:bg-primary/5"
              >
                Take a little look <PawPrint size={16} />
              </ButtonLink>
            </div>
            <div className="mt-9 flex gap-5 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-primary" /> Made for every pet
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={15} className="text-primary" /> Built around you
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xl pb-8 pl-3 sm:pl-8">
            <div className="absolute -right-3 top-5 h-[92%] w-[90%] rounded-[44%_44%_25%_25%] bg-[#e5e9da] rotate-6" />
            <div className="relative h-[430px] overflow-hidden rounded-[44%_44%_24px_24px] sm:h-[510px]">
              <img
                className="photo"
                src="/images/golden.jpg"
                alt="A golden retriever resting peacefully"
              />
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/50 to-transparent px-8 pb-7 pt-20 text-white">
                <p className="text-3xl font-semibold">
                  More belly rubs.
                  <br />
                  Less life admin.
                </p>
              </div>
            </div>
            <div className="absolute -left-2 top-14 flex items-center gap-3 rounded-2xl border border-white bg-white/95 p-4 shadow-lg">
              <span className="rounded-full bg-[#edf2e7] p-3 text-primary">
                <ShieldCheck size={23} />
              </span>
              <div>
                <p className="text-sm font-bold">
                  One little ID. Endless love.
                </p>
                <p className="mt-1 text-xs text-muted">
                  Their story, always with you.
                </p>
              </div>
            </div>
            <div className="absolute -right-2 bottom-0 flex items-center gap-3 rounded-2xl border border-white bg-white p-4 shadow-lg">
              <span className="rounded-full bg-[#f9e7db] p-3 text-accent">
                <Heart size={23} />
              </span>
              <div>
                <p className="text-sm font-bold">Good things come in paws.</p>
                <p className="mt-1 text-xs text-muted">
                  Let’s make a little more room for joy.
                </p>
              </div>
            </div>
            <Sparkles
              className="absolute -right-5 -top-7 text-accent"
              size={38}
            />
          </div>
        </section>
        <div className="border-y border-primary/10 bg-[#eef0e7] px-6 py-5 text-center text-xs font-semibold tracking-[.18em] text-primary sm:text-sm">
          ONE APP. EVERY PAW. EVERYTHING.
        </div>
        <section id="world" className="mx-auto max-w-7xl px-6 py-20 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow">A little of everything they love</p>
              <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">
                Big love. One little app.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-muted">
              A home for the everyday moments and the big adventures. Here’s the
              world we’re building.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m, i) => {
              const Icon = icons[i];
              return (
                <article key={m.name} className="card lift p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <span
                      className="rounded-2xl p-3"
                      style={{ background: m.color }}
                    >
                      <Icon size={24} />
                    </span>
                    <span className="rounded-full bg-background px-3 py-1 text-[10px] text-muted">
                      Coming in a future milestone
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{m.name}</h3>
                  <p className="mt-2 text-sm text-muted">{m.tag}</p>
                </article>
              );
            })}
          </div>
        </section>
        <section
          id="identity"
          className="mx-auto mb-20 grid max-w-6xl gap-10 rounded-[32px] bg-[#e8ecdf] p-8 md:grid-cols-2 md:p-16"
        >
          <div className="card rotate-[-3deg] p-7">
            <div className="flex justify-between">
              <Brand />
              <ShieldCheck className="text-primary" />
            </div>
            <p className="eyebrow mt-8">Their very own Pawr ID</p>
            <h3 className="mt-3 text-4xl font-semibold">Meet Milo.</h3>
            <p className="mt-2 text-muted">
              Golden Retriever · Chief joy officer
            </p>
            <div className="mt-7 flex gap-2">
              <span className="rounded-full bg-background px-4 py-2 text-xs">
                Playful
              </span>
              <span className="rounded-full bg-background px-4 py-2 text-xs">
                Very good boy
              </span>
            </div>
            <p className="mt-7 border-t border-primary/10 pt-4 text-xs text-muted">
              Illustrative pet profile · Demo data
            </p>
          </div>
          <div className="self-center">
            <p className="eyebrow">Small profile. Big personality.</p>
            <h2 className="mt-4 text-4xl font-semibold">
              Everything that makes
              <br />
              them, them.
            </h2>
            <p className="mt-5 text-sm leading-7 text-muted">
              Their quirks, their milestones, their important details. Keep your
              pets’ profiles together, with health records kept private.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex items-center gap-3 font-semibold text-primary"
            >
              Create their Pawr ID <ArrowRight size={18} />
            </Link>
          </div>
        </section>
        <section className="bg-primary px-6 py-16 text-center text-white">
          <PawPrint className="mx-auto mb-5" size={32} />
          <h2 className="text-4xl font-semibold sm:text-5xl">
            Life’s better with a little pawr.
          </h2>
          <p className="mt-4 text-white/75">
            Start with their story. We’ll grow together.
          </p>
          <ButtonLink
            href="/signup"
            className="mt-7 bg-background text-primary hover:bg-white"
          >
            Let’s get started <ArrowRight size={17} />
          </ButtonLink>
        </section>
      </main>
      <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-10 lg:px-12">
        <Brand />
        <p className="text-xs text-muted">
          Made for the ones who make our lives whole.
        </p>
        <Link href="/about" className="text-xs">
          About Pawr
        </Link>
      </footer>
    </>
  );
}
