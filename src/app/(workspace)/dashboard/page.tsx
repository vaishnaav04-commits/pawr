import { requireUser } from "@/lib/auth";
import { Dashboard } from "@/components/dashboard";
export default async function Page() {
  const { db, user } = await requireUser();
  const [{ data: profile, error: pe }, { data: pets, error }] =
    await Promise.all([
      db.from("profiles").select("full_name").eq("id", user.id).single(),
      db
        .from("pets")
        .select("id,name,breed,species,temperament")
        .eq("owner_id", user.id)
        .order("created_at"),
    ]);
  if (error || pe)
    throw new Error(
      "Could not load your account. Check the database migrations and try again.",
    );
  return <Dashboard name={profile?.full_name || "friend"} pets={pets || []} />;
}
