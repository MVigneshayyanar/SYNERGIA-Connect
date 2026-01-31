import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import { Education, Healthcare, Transport, Housing } from "./pages/Modules";

// Marketplace
import PropertySearch from "./pages/Marketplace/PropertySearch";
import PropertyDetails from "./pages/Marketplace/PropertyDetails";

// Property Management
import TenantDashboard from "./pages/PropertyManagement/TenantDashboard";
import LandlordDashboard from "./pages/PropertyManagement/LandlordDashboard";
import PaymentPortal from "./pages/PropertyManagement/PaymentPortal";
import MaintenanceRequests from "./pages/PropertyManagement/MaintenanceRequests";

// Home Services
import ServiceBrowse from "./pages/HomeServices/ServiceBrowse";
import ProviderProfile from "./pages/HomeServices/ProviderProfile";
import BookingCalendar from "./pages/HomeServices/BookingCalendar";

// Housing
import PostProperty from "./pages/housing/PostProperty";

function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="profile" element={<Profile />} />

                {/* Original Modules */}
                <Route path="education" element={<Education />} />
                <Route path="healthcare" element={<Healthcare />} />
                <Route path="transport" element={<Transport />} />
                <Route path="housing" element={<Housing />} />

                {/* Marketplace */}
                <Route path="marketplace" element={<PropertySearch />} />
                <Route path="marketplace/property/:id" element={<PropertyDetails />} />
                <Route path="post-property" element={<PostProperty />} />

                {/* Property Management */}
                <Route path="property-management/tenant" element={<TenantDashboard />} />
                <Route path="property-management/landlord" element={<LandlordDashboard />} />
                <Route path="property-management/payment" element={<PaymentPortal />} />
                <Route path="property-management/maintenance" element={<MaintenanceRequests />} />

                {/* Home Services */}
                <Route path="home-services" element={<ServiceBrowse />} />
                <Route path="home-services/provider/:id" element={<ProviderProfile />} />
                <Route path="home-services/booking/:providerId" element={<BookingCalendar />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
