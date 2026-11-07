import { requireUser } from "@/lib/auth";
import { WorkspaceShell } from "@/components/workspace-shell";
export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
