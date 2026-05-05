import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ProfileCard } from "@/components/right-panel/ProfileCard";
import { CalendarCard } from "@/components/right-panel/CalendarCard";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <div className="flex gap-6 p-6 min-h-full">
            {/* Central content */}
            <div className="flex-1 min-w-0 flex flex-col gap-5">
              {children}
            </div>

            {/* Right panel */}
            <aside className="w-72 shrink-0 hidden lg:flex flex-col gap-5">
              <ProfileCard />
              <CalendarCard />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}
