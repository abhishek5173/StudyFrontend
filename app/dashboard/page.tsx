import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: 40 }}>
        <h2>Dashboard</h2>
        <p>Welcome to the dashboard!</p>
      </div>
    </ProtectedRoute>
  );
}
