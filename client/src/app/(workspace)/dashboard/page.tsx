import { DashboardInsightsView } from "@/components/dashboard/dashboard-insights";
import { WorkspaceHeader } from "@/components/layout/workspace-header";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WorkspaceHeader
        title="Productivity insights"
        subtitle="A premium overview of note volume, AI usage, editing momentum, and the themes shaping your workspace."
      />

      <DashboardInsightsView />
    </div>
  );
}
