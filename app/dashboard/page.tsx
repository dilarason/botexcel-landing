// app/dashboard/page.tsx

import RecentActivity from "../../components/RecentActivity";

export default function DashboardPage() {
  return (
    <main>
      {/* ... */}
      <RecentActivity limit={10} />
    </main>
  );
}
