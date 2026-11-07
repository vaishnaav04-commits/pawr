import { requireUser } from "@/lib/auth";
import { ProfileForm } from "@/components/pet-tools";
export default async function Page() {
  const { db, user } = await requireUser();
  const { data, error } = await db
    .from("profiles")
    .select("full_name,city")
    .eq("id", user.id)
    .single();
  if (error) throw error;
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">The human behind the paws</p>
      <h1 className="mt-3 text-4xl font-semibold">Your profile</h1>
      <p className="mt-4 text-sm text-muted">{user.email}</p>
      <ProfileForm name={data.full_name} city={data.city || ""} />
    </div>
  );
}
