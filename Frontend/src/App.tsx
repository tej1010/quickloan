import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import VendorLayout from "./layout/VendorLayout";
import CustomerMobileLayout from "./layout/CustomerMobileLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import VendorLogin from "./pages/vendor/auth/VendorLogin";
import VendorForgotPassword from "./pages/vendor/auth/VendorForgotPassword";
import VendorResetPassword from "./pages/vendor/auth/VendorResetPassword";
import VendorDashboard from "./pages/vendor/dashboard/VendorDashboard";
import VendorApplications from "./pages/vendor/applications/VendorApplications";
import VendorApplicationDetail from "./pages/vendor/applications/VendorApplicationDetail";
import NewLoanApplication from "./pages/vendor/applications/NewLoanApplication";
import VendorOnboarding from "./pages/vendor/onboarding/VendorOnboarding";
import VendorEmiManagement from "./pages/vendor/emi/VendorEmiManagement";
import VendorDisbursements from "./pages/vendor/disbursements/VendorDisbursements";
import VendorBranches from "./pages/vendor/branches/VendorBranches";
import VendorNotifications from "./pages/vendor/notifications/VendorNotifications";
import VendorProfile from "./pages/vendor/profile/VendorProfile";

import CustomerLogin from "./pages/customer/auth/CustomerLogin";
import CustomerDashboard from "./pages/customer/dashboard/CustomerDashboard";
import CustomerLoans from "./pages/customer/loans/CustomerLoans";
import CustomerLoanDetail from "./pages/customer/loans/CustomerLoanDetail";
import CustomerEmiSchedule from "./pages/customer/loans/CustomerEmiSchedule";
import CustomerPayEmi from "./pages/customer/payments/CustomerPayEmi";
import CustomerPaymentSuccess from "./pages/customer/payments/CustomerPaymentSuccess";
import CustomerDocuments from "./pages/customer/documents/CustomerDocuments";
import CustomerNotifications from "./pages/customer/notifications/CustomerNotifications";
import CustomerProfile from "./pages/customer/profile/CustomerProfile";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/vendor/login" replace />} />

        <Route element={<AppLayout />}>
          <Route path="/admin" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/blank" element={<Blank />} />
          <Route path="/form-elements" element={<FormElements />} />
          <Route path="/basic-tables" element={<BasicTables />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />
        </Route>

        <Route path="/vendor/login" element={<VendorLogin />} />
        <Route path="/vendor/forgot-password" element={<VendorForgotPassword />} />
        <Route path="/vendor/reset-password" element={<VendorResetPassword />} />
        <Route path="/vendor/onboarding" element={<VendorOnboarding />} />

        <Route element={<ProtectedRoute allowedRoles={["vendor"]} loginPath="/vendor/login" />}>
          <Route element={<VendorLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/applications" element={<VendorApplications />} />
            <Route path="/vendor/applications/new" element={<NewLoanApplication />} />
            <Route path="/vendor/applications/:id" element={<VendorApplicationDetail />} />
            <Route path="/vendor/emi" element={<VendorEmiManagement />} />
            <Route path="/vendor/disbursements" element={<VendorDisbursements />} />
            <Route path="/vendor/branches" element={<VendorBranches />} />
            <Route path="/vendor/notifications" element={<VendorNotifications />} />
            <Route path="/vendor/profile" element={<VendorProfile />} />
          </Route>
        </Route>

        <Route path="/customer/login" element={<CustomerLogin />} />

        <Route element={<ProtectedRoute allowedRoles={["customer"]} loginPath="/customer/login" />}>
          <Route element={<CustomerMobileLayout />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/loans" element={<CustomerLoans />} />
            <Route path="/customer/loans/:id" element={<CustomerLoanDetail />} />
            <Route path="/customer/loans/:id/schedule" element={<CustomerEmiSchedule />} />
            <Route path="/customer/pay-emi" element={<CustomerPayEmi />} />
            <Route path="/customer/payment-success" element={<CustomerPaymentSuccess />} />
            <Route path="/customer/documents" element={<CustomerDocuments />} />
            <Route path="/customer/notifications" element={<CustomerNotifications />} />
            <Route path="/customer/profile" element={<CustomerProfile />} />
          </Route>
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
