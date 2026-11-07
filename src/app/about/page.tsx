import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
export default function Page() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-6 py-12">
      <Brand />
      <p className="eyebrow mt-20">Our story is just beginning</p>
      <h1 className="mt-5 text-5xl font-semibold">
        For every kind of pet.
        <br />
        For all the love they bring.
      </h1>
      <p className="mt-8 text-lg leading-8 text-muted">
        Pawr brings your pets’ lives into one thoughtful place. We’re starting
        with the essentials: a secure account, a home for your pack, and a
        digital identity for each pet.
      </p>
      <p className="mb-9 mt-6 leading-8 text-muted">
        Our vision includes care, grooming, community, adoption, and more. Those
        experiences are planned for future milestones. Today, your pet’s story
        comes first.
      </p>
      <ButtonLink href="/signup">Join the pack</ButtonLink>
    </main>
  );
}
