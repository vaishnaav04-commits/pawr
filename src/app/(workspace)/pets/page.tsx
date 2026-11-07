import { requireUser } from "@/lib/auth";
import { PetCards } from "@/components/dashboard";
import { ButtonLink } from "@/components/ui/button";
export default async function Page() {
  const { db, user } = await requireUser();
  const { data, error } = await db
    .from("pets")
    .select("id,name,breed,species,temperament")
    .eq("owner_id", user.id)
    .order("created_at");
  if (error) throw error;
  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Their stories live here</p>
          <h1 className="mt-3 text-4xl font-semibold">Your little pack</h1>
        </div>
        <ButtonLink href="/pets/new">+ Add a pet</ButtonLink>
      </div>
      {data.length ? (
        <PetCards pets={data} />
      ) : (
        <div className="card p-10 text-center">
          <h2 className="text-2xl font-semibold">A home for every paw.</h2>
          <p className="mt-4 text-muted">
            Your pack is waiting to be introduced. Add your first pet to get
            started.
          </p>
        </div>
      )}
    </>
  );
}
