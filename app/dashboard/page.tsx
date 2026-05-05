import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ScheduledEvents } from "@/components/dashboard/ScheduledEvents";
import { PlansDone } from "@/components/dashboard/PlansDone";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <HeroBanner />
      <StatsCards />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ScheduledEvents />
        <PlansDone />
      </div>
    </DashboardLayout>
  );
}
