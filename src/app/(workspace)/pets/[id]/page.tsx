import { requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ButtonLink } from "@/components/ui/button";
import { DeletePet, UploadPetFile } from "@/components/pet-tools";
import { PawPrint } from "lucide-react";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const { db, user } = await requireUser();
  const { data: p, error } = await db
    .from("pets")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (error) throw error;
  if (!p) notFound();
  const [
    { data: photos, error: photoError },
    { data: records, error: recordError },
    { data: verification, error: verificationError },
  ] = await Promise.all([
    db.from("pet_photos").select("*").eq("pet_id", id),
    db.from("pet_health_records").select("*").eq("pet_id", id),
    db
      .from("pet_verifications")
      .select("status")
      .eq("pet_id", id)
      .maybeSingle(),
  ]);
  if (photoError || recordError || verificationError)
    throw new Error("Could not load pet records");
  const images = await Promise.all(
    (photos || []).map(async (photo) => {
      const { data } = await db.storage
        .from("pet-photos")
        .createSignedUrl(photo.storage_path, 300);
      return { id: photo.id, url: data?.signedUrl };
    }),
  );
  const documents = await Promise.all(
    (records || []).map(async (record) => {
      const { data } = await db.storage
        .from("pet-medical")
        .createSignedUrl(record.storage_path, 300);
      return { ...record, url: data?.signedUrl };
    }),
  );
  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="eyebrow">
            Pawr ID · {verification?.status || "Not verified"}
          </p>
          <h1 className="mt-3 text-5xl font-semibold">{p.name}</h1>
          <p className="mt-3 text-muted">
            {p.breed || p.species} · {p.city || "City not added"}
          </p>
        </div>
        <ButtonLink href={`/pets/${id}/edit`}>Edit profile</ButtonLink>
      </div>
      <div className="card mt-8 p-7">
        <PawPrint className="mb-5 text-primary" size={36} />
        <p className="text-xl">
          {p.temperament || "A personality all their own."}
        </p>
        <dl className="mt-7 grid gap-5 text-sm sm:grid-cols-3">
          {[
            ["Birthday", p.date_of_birth || "Not added"],
            ["Sex", p.sex],
            ["Weight", p.weight_kg ? `${p.weight_kg} kg` : "Not added"],
            ["Vaccinations", p.vaccination_status.replaceAll("_", " ")],
            ["Spayed / neutered", p.neutered ? "Yes" : "No / unknown"],
            ["Matching preference", p.matching_mode],
            ["Discovery opt-in", p.visible ? "Yes (not active yet)" : "No"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <section className="card mt-6 p-7">
        <h2 className="text-2xl font-semibold">A face to love</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map(
            (photo) =>
              photo.url && (
                <img
                  key={photo.id}
                  className="aspect-square w-full rounded-2xl object-cover"
                  src={photo.url}
                  alt={p.name}
                />
              ),
          )}
        </div>
        {!images.length && (
          <p className="mt-4 text-sm text-muted">
            No photos yet. Add their best smile.
          </p>
        )}
        <UploadPetFile id={id} kind="photo" />
      </section>
      <section className="card mt-6 p-7">
        <h2 className="text-2xl font-semibold">Private health records</h2>
        <p className="mt-3 text-sm text-muted">
          Only you can open these files. Signed links expire after five minutes.
        </p>
        <ul className="mt-5 space-y-3">
          {documents.map((r) => (
            <li key={r.id}>
              {r.url ? (
                <a
                  className="text-sm text-primary underline"
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.title} ↗
                </a>
              ) : (
                <span>File temporarily unavailable</span>
              )}
            </li>
          ))}
        </ul>
        {!documents.length && (
          <p className="mt-4 text-sm text-muted">
            No health documents added yet.
          </p>
        )}
        <UploadPetFile id={id} kind="medical" />
      </section>
      <DeletePet id={id} />
    </div>
  );
}
