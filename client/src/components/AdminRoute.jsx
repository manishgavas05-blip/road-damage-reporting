import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin user
  return children;
}

export default AdminRoute;