import { PetForm } from "@/components/pet-form";
export default function Page() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Meet the newest member</p>
      <h1 className="mt-3 text-4xl font-semibold">A Pawr ID of their own.</h1>
      <p className="mt-4 text-sm text-muted">
        Start with the little details. You can add photos and health documents
        after saving.
      </p>
      <PetForm />
    </div>
  );
}
