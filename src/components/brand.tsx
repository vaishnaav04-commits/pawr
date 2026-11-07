import Link from "next/link";
import { PawPrint } from "lucide-react";
export function Brand() {
  return (
    <Link
      href="/"
      aria-label="Pawr home"
      className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tighter"
    >
      <span className="rounded-xl bg-primary p-2 text-white">
        <PawPrint size={23} />
      </span>
      pawr<span className="text-accent">.</span>
    </Link>
  );
}
