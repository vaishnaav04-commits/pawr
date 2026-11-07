import { z } from "zod";
export const petSchema = z.object({
  name: z.string().trim().min(1, "Give your pet a name").max(80),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"]),
  breed: z.string().trim().max(100),
  date_of_birth: z
    .string()
    .refine(
      (v) =>
        !v ||
        (z.iso.date().safeParse(v).success &&
          !Number.isNaN(Date.parse(v)) &&
          v <= new Date().toISOString().slice(0, 10)),
      "Use a valid birth date in the past",
    ),
  sex: z.enum(["male", "female", "unknown"]),
  weight_kg: z
    .string()
    .refine(
      (v) =>
        !v ||
        (Number.isFinite(Number(v)) && Number(v) > 0 && Number(v) <= 1000),
      "Enter a weight between 0 and 1000 kg",
    ),
  temperament: z.string().trim().max(300),
  city: z.string().trim().max(100),
  vaccination_status: z.enum(["unknown", "up_to_date", "due"]),
  neutered: z.boolean(),
  visible: z.boolean(),
  matching_mode: z.enum(["playdate", "companionship"]),
});
export type PetInput = z.infer<typeof petSchema>;
export const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  city: z.string().trim().max(100),
});
