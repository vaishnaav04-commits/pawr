import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Pawr — One App. Every Paw. Everything.",
    template: "%s | Pawr",
  },
  description:
    "A little more joy. A lot more care. Your pet’s world, together in Pawr.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
