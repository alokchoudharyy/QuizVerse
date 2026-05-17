import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import "./index.css";

// Components & Layouts
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/DashboardLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuizAttempt from "./pages/QuizAttempt";
import QuizResult from "./pages/QuizResult";
import History from "./pages/History";
import Leaderboard from "./pages/Leaderboard";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Badges from './pages/Badges';
import Resources from './pages/Resources';
import Vault from "./pages/Vault";
import Analytics from "./pages/Analytics"; // 🔥 ADVANCED ANALYTICS IMPORT KIYA 🔥

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#070A13] text-slate-100 font-sans selection:bg-indigo-500/30 flex flex-col">
        <main className="flex-grow relative">
          <Routes>
            {/* Direct landing routes handle */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Auth Open Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />

            {/* Protected Dashboard Area Routes (Wrapped inside Sidebar & Footer) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Analytics />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Leaderboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quiz-result"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <QuizResult />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <History />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="/vault" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Vault />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/badges" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Badges />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/resources" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Resources />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/support"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Support />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Pure Fullscreen Exam Environment (No Sidebar distractions) */}
            <Route
              path="/quiz-attempt"
              element={
                <ProtectedRoute>
                  <QuizAttempt />
                </ProtectedRoute>
              }
            />

            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(15, 23, 42, 0.95)",
              color: "#F8FAFC",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              backdropFilter: "blur(10px)",
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}