import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CafeForm from "./pages/Admin/CafeForm";
import AddCafe from "./pages/Admin/cafes/AddCafe";
import ReviewManagement from "./pages/Admin/ReviewManagement";
import PromotionManagement from "./pages/Admin/PromotionManagement";
import MenuManagement from "./pages/Admin/MenuManagement";
import CafeDetailPageUser from "./pages/CafeDetailPageUser";
import CafeListingPage from "./pages/CafeListingPage";
import Home from "./pages/Home";
import About from "./pages/About";
import CafeSubmissionForm from "./pages/CafeSubmissionForm";
import AdminLayout from "./components/Admin/Layout/AdminLayout";
import CafeList from "./pages/Admin/cafes/CafeList";
import EditCafe from "./pages/Admin/cafes/EditCafe";
import CafeRequests from "./pages/Admin/CafeRequests";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/Admin/Auth/ProtectedRoute";

gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    gsap.config({
      nullTargetWarn: false,
    });
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cafes" element={<CafeListingPage />} />
          {/* <Route path="/admin/cafe/:id" element={<CafeDetailPage />} /> */}
          <Route path="/cafes/:id" element={<CafeDetailPageUser />} />
          <Route path="/about" element={<About />} />
          <Route path="/cafe-form" element={<CafeSubmissionForm />} />
          {/* Admin login route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/cafes/:id/edit" element={<EditCafe />} />
          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/cafe-requests" element={<CafeRequests />} />
          <Route path="/admin/add-cafe" element={<AddCafe />} />
          <Route
            path="/admin/cafes/edit/:id"
            element={
              <ProtectedRoute>
                <CafeForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reviews"
            element={
              <ProtectedRoute>
                <ReviewManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/promotions"
            element={
              <ProtectedRoute>
                <PromotionManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute>
                <MenuManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="cafes" element={<CafeList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
