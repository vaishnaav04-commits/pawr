"use client";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema, type PetInput } from "@/lib/validation";
import { savePet } from "@/app/(workspace)/pets/actions";
import { Button } from "./ui/button";
export function PetForm({ pet }: { pet?: Partial<PetInput> & { id: string } }) {
  const [state, action, pending] = useActionState(savePet, {});
  const {
    register,
    formState: { errors },
  } = useForm<PetInput>({
    resolver: zodResolver(petSchema),
    mode: "onBlur",
    defaultValues: {
      name: pet?.name || "",
      species: pet?.species || "dog",
      breed: pet?.breed || "",
      sex: pet?.sex || "unknown",
      date_of_birth: pet?.date_of_birth || "",
      weight_kg: pet?.weight_kg || "",
      temperament: pet?.temperament || "",
      city: pet?.city || "",
      vaccination_status: pet?.vaccination_status || "unknown",
      neutered: pet?.neutered || false,
      visible: pet?.visible || false,
      matching_mode: pet?.matching_mode || "playdate",
    },
  });
  return (
    <form action={action} className="card mt-8 space-y-6 p-6 sm:p-9">
      <input type="hidden" name="id" value={pet?.id || ""} />
      <div className="grid gap-6 sm:grid-cols-2">
        <label>
          Pet’s name *<input {...register("name")} required maxLength={80} />
          {errors.name && (
            <span className="field-error">{errors.name.message}</span>
          )}
        </label>
        <label>
          Species
          <select {...register("species")}>
            {["dog", "cat", "rabbit", "bird", "other"].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Breed
          <input
            {...register("breed")}
            maxLength={100}
            placeholder="Mixed breed is welcome, too"
          />
        </label>
        <label>
          Date of birth
          <input
            type="date"
            {...register("date_of_birth")}
            max={new Date().toISOString().slice(0, 10)}
          />
        </label>
        <label>
          Sex
          <select {...register("sex")}>
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Weight (kg)
          <input
            type="number"
            step="0.01"
            min="0.01"
            max="1000"
            {...register("weight_kg")}
          />
        </label>
        <label>
          City
          <input
            {...register("city")}
            maxLength={100}
            placeholder="City only — no precise address"
          />
        </label>
        <label>
          Vaccination status
          <select {...register("vaccination_status")}>
            <option value="unknown">Unknown</option>
            <option value="up_to_date">Up to date</option>
            <option value="due">Due</option>
          </select>
        </label>
      </div>
      <label>
        A little about their personality
        <textarea
          {...register("temperament")}
          maxLength={300}
          rows={3}
          placeholder="Loves puddles. Will work for treats."
        />
      </label>
      <label>
        Future matching preference
        <select {...register("matching_mode")}>
          <option value="playdate">Playdates</option>
          <option value="companionship">Companionship</option>
        </select>
        <span className="mt-2 block text-xs font-normal text-muted">
          Matching is not active yet. Breeding introductions are disabled.
        </span>
      </label>
      <label className="flex items-center">
        <input type="checkbox" {...register("neutered")} /> Spayed / neutered
      </label>
      <label className="flex items-center">
        <input type="checkbox" {...register("visible")} /> Opt in to discovery
        when matching launches
      </label>
      <p className="text-xs leading-5 text-muted">
        Your profile stays owner-only in this milestone. Verification is
        reviewed separately; owner-entered health details are not veterinary
        clearance.
      </p>
      {state.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-800"
        >
          {state.error}
        </p>
      )}
      <Button disabled={pending}>{pending ? "Saving…" : "Save Pawr ID"}</Button>
    </form>
  );
}
