import { ButtonLink } from "@/components/ui/button";
export default function NotFound() {
  return (
    <main id="main" className="p-20 text-center">
      <h1 className="text-4xl font-semibold">This paw wandered off.</h1>
      <p className="my-6 text-muted">
        The page or pet you’re looking for isn’t available to your account.
      </p>
      <ButtonLink href="/">Back home</ButtonLink>
    </main>
  );
}
