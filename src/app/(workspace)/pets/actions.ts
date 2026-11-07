"use server";
import { requireUser } from "@/lib/auth";
import { petSchema, profileSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
export async function savePet(
  _: { error?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  const { db, user } = await requireUser();
  const parsed = petSchema.safeParse({
    ...Object.fromEntries(form),
    neutered: form.get("neutered") === "on",
    visible: form.get("visible") === "on",
  });
  if (!parsed.success)
    return { error: parsed.error.issues.map((i) => i.message).join(". ") };
  const id = String(form.get("id") || "");
  if (id && !z.uuid().safeParse(id).success)
    return { error: "Invalid pet identifier." };
  const pet = {
    ...parsed.data,
    date_of_birth: parsed.data.date_of_birth || null,
    weight_kg: parsed.data.weight_kg ? Number(parsed.data.weight_kg) : null,
    owner_id: user.id,
  };
  if (id) {
    const { data, error } = await db
      .from("pets")
      .update(pet)
      .eq("id", id)
      .eq("owner_id", user.id)
      .select("id")
      .single();
    if (error || !data)
      return { error: "Could not save this pet. Please try again." };
  } else {
    const { data, error } = await db
      .from("pets")
      .insert(pet)
      .select("id")
      .single();
    if (error) return { error: error.message };
    revalidatePath("/dashboard");
    redirect(`/pets/${data.id}`);
  }
  revalidatePath("/pets");
  revalidatePath("/dashboard");
  redirect(`/pets/${id}`);
}
export async function deletePet(
  _: { error?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  const { db, user } = await requireUser();
  const id = String(form.get("id"));
  if (!z.uuid().safeParse(id).success) return { error: "Invalid pet." };
  const { error } = await db
    .from("pets")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)
    .select("id")
    .single();
  if (error) return { error: "Could not delete this pet." };
  revalidatePath("/dashboard");
  redirect("/pets");
}
export async function saveProfile(
  _: { error?: string; success?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  const { db, user } = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success)
    return { error: "Enter a name and a city of up to 100 characters." };
  const { error } = await db
    .from("profiles")
    .update(parsed.data)
    .eq("id", user.id)
    .select("id")
    .single();
  if (error) return { error: "Could not save your profile." };
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: "Your profile is saved." };
}
export async function uploadPetFile(
  _: { error?: string; success?: string },
  form: FormData,
): Promise<{ error?: string; success?: string }> {
  const { db, user } = await requireUser();
  const id = String(form.get("pet_id"));
  const kind = String(form.get("kind"));
  const file = form.get("file");
  if (
    !z.uuid().safeParse(id).success ||
    !["photo", "medical"].includes(kind) ||
    !(file instanceof File) ||
    !file.size
  )
    return { error: "Choose a file to upload." };
  const allowed =
    kind === "photo"
      ? ["image/jpeg", "image/png", "image/webp"]
      : ["application/pdf", "image/jpeg", "image/png"];
  if (file.size > 5 * 1024 * 1024 || !allowed.includes(file.type))
    return { error: "Use an allowed file type up to 5 MB." };
  const { data: pet } = await db
    .from("pets")
    .select("id")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single();
  if (!pet) return { error: "Pet not found." };
  const bucket = kind === "photo" ? "pet-photos" : "pet-medical";
  const path = `${user.id}/${id}/${crypto.randomUUID()}`;
  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type });
  if (error)
    return { error: "Upload failed. Check storage setup and try again." };
  const result =
    kind === "photo"
      ? await db.from("pet_photos").insert({ pet_id: id, storage_path: path })
      : await db
          .from("pet_health_records")
          .insert({
            pet_id: id,
            title: file.name.slice(0, 200),
            storage_path: path,
          });
  if (result.error) {
    await db.storage.from(bucket).remove([path]);
    return { error: "Could not save the file record. Please retry." };
  }
  revalidatePath(`/pets/${id}`);
  return { success: "File saved privately." };
}
