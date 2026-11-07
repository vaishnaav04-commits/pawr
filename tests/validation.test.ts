import { test } from "node:test";
import assert from "node:assert/strict";
import { petSchema, profileSchema } from "../src/lib/validation";
const pet = {
  name: " Milo ",
  species: "dog",
  breed: "Retriever",
  date_of_birth: "2024-01-01",
  sex: "male",
  weight_kg: "25",
  temperament: "Playful",
  city: "Bengaluru",
  vaccination_status: "unknown",
  neutered: false,
  visible: false,
  matching_mode: "playdate",
};
test("normalizes valid pet input", () => {
  assert.equal(petSchema.parse(pet).name, "Milo");
});
test("rejects invalid weights, future birthdays, and breeding mode", () => {
  for (const patch of [
    { weight_kg: "-2" },
    { weight_kg: "NaN" },
    { weight_kg: "Infinity" },
    { date_of_birth: "2999-01-01" },
    { date_of_birth: "nonsense" },
    { matching_mode: "breeding" },
  ])
    assert.equal(petSchema.safeParse({ ...pet, ...patch }).success, false);
});
test("rejects blank names and overly long location", () => {
  assert.equal(petSchema.safeParse({ ...pet, name: "  " }).success, false);
  assert.equal(
    profileSchema.safeParse({ full_name: "A", city: "x".repeat(101) }).success,
    false,
  );
});
test("does not accept owner identity from form schema", () => {
  assert.equal(
    "owner_id" in petSchema.parse({ ...pet, owner_id: "someone-else" }),
    false,
  );
});
