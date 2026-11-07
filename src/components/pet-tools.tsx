"use client";
import { useActionState, useState, useRef, useEffect } from "react";
import {
  deletePet,
  uploadPetFile,
  saveProfile,
} from "@/app/(workspace)/pets/actions";
import { Button } from "./ui/button";
function Confirmation({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby="delete-title"
      className="m-auto max-w-md rounded-3xl bg-white p-8 text-foreground backdrop:bg-black/40"
    >
      {children}
    </dialog>
  );
}
export function DeletePet({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [state, action, pending] = useActionState(deletePet, {});
  return (
    <div className="mt-9 border-t border-primary/10 pt-6">
      <button
        className="text-sm text-red-800 underline"
        onClick={() => setConfirm(true)}
      >
        Delete this pet
      </button>
      {confirm && (
        <Confirmation onClose={() => setConfirm(false)}>
          <h2 id="delete-title" className="text-2xl font-semibold">
            Delete this Pawr ID?
          </h2>
          <p className="my-5 text-sm text-muted">
            The pet profile and associated database records will be permanently
            removed. Uploaded objects are retained privately until storage
            cleanup.
          </p>
          <form action={action}>
            <input type="hidden" name="id" value={id} />
            {state.error && <p role="alert">{state.error}</p>}
            <div className="flex gap-3">
              <Button type="button" autoFocus onClick={() => setConfirm(false)}>
                Keep profile
              </Button>
              <Button disabled={pending} className="bg-red-800">
                {pending ? "Deleting…" : "Delete pet"}
              </Button>
            </div>
          </form>
        </Confirmation>
      )}
    </div>
  );
}
export function UploadPetFile({
  id,
  kind,
}: {
  id: string;
  kind: "photo" | "medical";
}) {
  const [state, action, pending] = useActionState(uploadPetFile, {});
  return (
    <form action={action} className="mt-5 space-y-3">
      <input type="hidden" name="pet_id" value={id} />
      <input type="hidden" name="kind" value={kind} />
      <label>
        {kind === "photo" ? "Add a pet photo" : "Add a private health document"}
        <input
          type="file"
          name="file"
          required
          accept={
            kind === "photo"
              ? "image/jpeg,image/png,image/webp"
              : "application/pdf,image/jpeg,image/png"
          }
        />
      </label>
      <p className="text-xs text-muted">
        {kind === "photo" ? "JPG, PNG or WebP" : "PDF, JPG or PNG"} · Up to 5 MB
        · Owner-only
      </p>
      {state.error && (
        <p role="alert" className="text-sm text-red-800">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-sm text-primary">
          {state.success}
        </p>
      )}
      <Button disabled={pending}>
        {pending ? "Uploading…" : "Upload privately"}
      </Button>
    </form>
  );
}
export function ProfileForm({ name, city }: { name: string; city: string }) {
  const [state, action, pending] = useActionState(saveProfile, {});
  return (
    <form action={action} className="card mt-8 space-y-6 p-8">
      <label>
        Your name
        <input name="full_name" required maxLength={100} defaultValue={name} />
      </label>
      <label>
        City
        <input name="city" maxLength={100} defaultValue={city} />
      </label>
      <p className="text-xs text-muted">
        Pet owner access is assigned automatically. Provider and administrator
        roles cannot be self-assigned.
      </p>
      {state.error && (
        <p role="alert" className="text-red-800">
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" className="text-primary">
          {state.success}
        </p>
      )}
      <Button disabled={pending}>{pending ? "Saving…" : "Save profile"}</Button>
    </form>
  );
}
