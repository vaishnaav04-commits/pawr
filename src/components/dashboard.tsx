import Link from "next/link";
import {
  ArrowRight,
  Plus,
  PawPrint,
  Sparkles,
  ShieldCheck,
  Heart,
  Stethoscope,
  Scissors,
  ShoppingBag,
  House,
  Users,
} from "lucide-react";
import { ButtonLink } from "./ui/button";
import { modules } from "@/lib/demo";
const icons = [Heart, Stethoscope, Scissors, ShoppingBag, House, Users];
export type PetCard = {
  id: string;
  name: string;
  breed: string | null;
  species: string;
  image?: string;
  temperament?: string | null;
  age?: string;
};
export function PetCards({
  pets,
  demo = false,
}: {
  pets: PetCard[];
  demo?: boolean;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {pets.map((p) => (
        <article key={p.id} className="card overflow-hidden">
          {p.image ? (
            <div className="h-52">
              <img className="photo" src={p.image} alt={p.name} />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center bg-[#e7ecde]">
              <PawPrint size={50} className="text-primary/50" />
            </div>
          )}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{p.name}</h3>
              <span className="rounded-full bg-[#edf1e7] px-3 py-1 text-[10px] text-primary">
                {demo ? "Demo profile" : "Pawr ID"}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted">
              {p.breed || p.species}
              {p.age && ` · ${p.age}`}
            </p>
            <p className="mt-4 text-sm">
              {p.temperament || "A personality all their own."}
            </p>
            {!demo && (
              <Link
                href={`/pets/${p.id}`}
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                View their story <ArrowRight size={15} />
              </Link>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
export function Dashboard({
  name,
  pets,
  demo = false,
}: {
  name: string;
  pets: PetCard[];
  demo?: boolean;
}) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="eyebrow">Small moments. Big love.</p>
          <h1 className="mt-2 text-4xl font-semibold">
            Hello, {name} <span className="text-accent">☀</span>
          </h1>
          <p className="mt-3 text-sm text-muted">
            Here’s to another good day with your favorite little souls.
          </p>
        </div>
        <ButtonLink href={demo ? "/signup" : "/pets/new"}>
          <Plus size={17} /> Add a pet
        </ButtonLink>
      </div>
      <section className="relative mb-9 grid overflow-hidden rounded-3xl bg-[#e5ebdd] md:grid-cols-2">
        <div className="p-8 lg:p-10">
          <span className="eyebrow flex items-center gap-2">
            <Sparkles size={14} /> A world of possibilities
          </span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight lg:text-4xl">
            Their best life.
            <br />
            Your favorite adventure.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
            Start with a Pawr ID. Keep their everyday details close and make a
            little space for what’s next.
          </p>
          <Link
            href={demo ? "/signup" : "/pets/new"}
            className="mt-6 inline-flex items-center gap-3 text-sm font-semibold"
          >
            Create a Pawr ID <ArrowRight size={17} />
          </Link>
        </div>
        <div className="h-64 md:h-full">
          <img
            className="photo"
            src="/images/dog.jpg"
            alt="A fluffy dog resting outdoors"
          />
        </div>
      </section>
      <section id="pets">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">
            Your little pack{" "}
            <span className="ml-1 text-sm font-normal text-muted">
              ({pets.length})
            </span>
          </h2>
          {!demo && (
            <Link className="text-xs font-semibold text-primary" href="/pets">
              All pet profiles →
            </Link>
          )}
        </div>
        {pets.length ? (
          <PetCards pets={pets} demo={demo} />
        ) : (
          <div className="card p-10 text-center">
            <PawPrint className="mx-auto text-primary" size={36} />
            <h3 className="mt-4 text-xl font-semibold">
              Every story starts with a paw.
            </h3>
            <p className="mb-6 mt-2 text-sm text-muted">
              Add your first pet to bring your pack together.
            </p>
            <ButtonLink href="/pets/new">Create their profile</ButtonLink>
          </div>
        )}
      </section>
      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Explore the Pawr world</h2>
          <span className="text-xs text-muted">Growing with you</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((m, i) => {
            const Icon = icons[i];
            return (
              <div className="card flex gap-4 p-5" key={m.name}>
                <span
                  className="h-fit rounded-xl p-3"
                  style={{ background: m.color }}
                >
                  <Icon size={21} />
                </span>
                <div>
                  <h3 className="font-semibold">{m.name}</h3>
                  <p className="mt-1 text-xs text-muted">{m.tag}</p>
                  <p className="mt-3 text-[10px] uppercase tracking-wider text-primary">
                    Coming in a future milestone
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <div className="mt-9 flex items-start gap-3 rounded-2xl border border-primary/10 p-5">
        <ShieldCheck size={23} className="shrink-0 text-primary" />
        <div>
          <p className="text-sm font-semibold">Their details. Your control.</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Pet profiles are private to your account in this milestone. Health
            documents use private storage and owner-only access.
          </p>
        </div>
      </div>
    </>
  );
}
