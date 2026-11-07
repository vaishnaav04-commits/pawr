import { WorkspaceShell } from "@/components/workspace-shell";
import { Dashboard } from "@/components/dashboard";
import { demoPets } from "@/lib/demo";
export default function Demo() {
  return (
    <WorkspaceShell demo>
      <Dashboard name="friend" pets={demoPets} demo />
    </WorkspaceShell>
  );
}
