import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import FeedbackForm from "./components/FeedbackForm";
import FeedbackList from "./components/FeedbackList";
import AdminLogin from "./components/AdminLogin";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function CursorGlow() {
  useEffect(() => {
    const glow = document.getElementById("cursor-glow");
    if (!glow) return;

    let rafId;
    const handleMove = (e) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      });
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="cursor-glow" />;
}

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-obsidian relative">
        <CursorGlow />
        <Navbar />
        <main className="py-12 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<FeedbackForm />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <FeedbackList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        {/* Cinematic ambient gradient at top */}
        <div className="fixed inset-x-0 top-0 h-64 pointer-events-none z-0"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(201,169,110,0.04) 0%, transparent 100%)",
          }}
        />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1c1c20",
            color: "#e8d5a3",
            border: "1px solid rgba(201,169,110,0.15)",
            borderRadius: "8px",
            fontSize: "0.875rem",
            fontFamily: "'Inter', sans-serif",
          },
          success: {
            iconTheme: { primary: "#c9a96e", secondary: "#0a0a0c" },
          },
          error: {
            iconTheme: { primary: "#c44d4d", secondary: "#0a0a0c" },
          },
        }}
      />
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
