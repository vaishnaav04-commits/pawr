import { requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { PetForm } from "@/components/pet-form";
import { z } from "zod";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { db, user } = await requireUser();
  const { data, error } = await db
    .from("pets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!data) notFound();
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-semibold">Edit {data.name}’s story</h1>
      <PetForm pet={{ ...data, weight_kg: data.weight_kg?.toString() || "" }} />
    </div>
  );
}
