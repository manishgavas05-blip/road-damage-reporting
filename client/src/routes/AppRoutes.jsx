import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ReportDamage from "../pages/ReportDamage";
import MyReports from "../pages/MyReports";
import CommunityReports from "../pages/CommunityReports";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Profile from "../pages/Profile";
import ReportDetails from "../pages/ReportDetails";
import NotFound from "../pages/NotFound";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =====================================================
            MAIN LAYOUT
        ===================================================== */}
        <Route element={<MainLayout />}>

          {/* =====================================================
              PUBLIC ROUTES
          ===================================================== */}

          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Register */}
          <Route path="/register" element={<Register />} />


          {/* =====================================================
              PROTECTED USER ROUTES
          ===================================================== */}

          {/* Report Damage */}
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportDamage />
              </ProtectedRoute>
            }
          />

          {/* My Reports */}
          <Route
            path="/my-reports"
            element={
              <ProtectedRoute>
                <MyReports />
              </ProtectedRoute>
            }
          />

          {/* Community Reports
              Every logged-in user can see reports
              submitted by other users.
          */}
          <Route
            path="/community-reports"
            element={
              <ProtectedRoute>
                <CommunityReports />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Report Details */}
          <Route
            path="/report/:id"
            element={
              <ProtectedRoute>
                <ReportDetails />
              </ProtectedRoute>
            }
          />


          {/* =====================================================
              ADMIN ROUTE
          ===================================================== */}

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />


          {/* =====================================================
              404
          ===================================================== */}

          <Route path="*" element={<NotFound />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;