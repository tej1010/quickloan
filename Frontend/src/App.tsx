import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import AppLayout from "./layout/AppLayout";
import VendorLayout from "./layout/VendorLayout";
import CustomerMobileLayout from "./layout/CustomerMobileLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { ScrollToTop } from "./components/common/ScrollToTop";
import RouteLoader from "./components/common/RouteLoader";

const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));
const UserProfiles = lazy(() => import("./pages/UserProfiles"));
const Videos = lazy(() => import("./pages/UiElements/Videos"));
const Images = lazy(() => import("./pages/UiElements/Images"));
const Alerts = lazy(() => import("./pages/UiElements/Alerts"));
const Badges = lazy(() => import("./pages/UiElements/Badges"));
const Avatars = lazy(() => import("./pages/UiElements/Avatars"));
const Buttons = lazy(() => import("./pages/UiElements/Buttons"));
const LineChart = lazy(() => import("./pages/Charts/LineChart"));
const BarChart = lazy(() => import("./pages/Charts/BarChart"));
const Calendar = lazy(() => import("./pages/Calendar"));
const BasicTables = lazy(() => import("./pages/Tables/BasicTables"));
const FormElements = lazy(() => import("./pages/Forms/FormElements"));
const Blank = lazy(() => import("./pages/Blank"));
const Home = lazy(() => import("./pages/Dashboard/Home"));

const VendorLogin = lazy(() => import("./pages/vendor/auth/VendorLogin"));
const VendorForgotPassword = lazy(() => import("./pages/vendor/auth/VendorForgotPassword"));
const VendorResetPassword = lazy(() => import("./pages/vendor/auth/VendorResetPassword"));
const VendorDashboard = lazy(() => import("./pages/vendor/dashboard/VendorDashboard"));
const VendorApplications = lazy(() => import("./pages/vendor/applications/VendorApplications"));
const VendorApplicationDetail = lazy(() => import("./pages/vendor/applications/VendorApplicationDetail"));
const NewLoanApplication = lazy(() => import("./pages/vendor/applications/NewLoanApplication"));
const VendorOnboarding = lazy(() => import("./pages/vendor/onboarding/VendorOnboarding"));
const VendorEmiManagement = lazy(() => import("./pages/vendor/emi/VendorEmiManagement"));
const VendorDisbursements = lazy(() => import("./pages/vendor/disbursements/VendorDisbursements"));
const VendorBranches = lazy(() => import("./pages/vendor/branches/VendorBranches"));
const VendorNotifications = lazy(() => import("./pages/vendor/notifications/VendorNotifications"));
const VendorProfile = lazy(() => import("./pages/vendor/profile/VendorProfile"));

const CustomerLogin = lazy(() => import("./pages/customer/auth/CustomerLogin"));
const CustomerDashboard = lazy(() => import("./pages/customer/dashboard/CustomerDashboard"));
const CustomerCompleteApplication = lazy(() => import("./pages/customer/apply/CustomerCompleteApplication"));
const CustomerLoans = lazy(() => import("./pages/customer/loans/CustomerLoans"));
const CustomerLoanDetail = lazy(() => import("./pages/customer/loans/CustomerLoanDetail"));
const CustomerEmiSchedule = lazy(() => import("./pages/customer/loans/CustomerEmiSchedule"));
const CustomerPayEmi = lazy(() => import("./pages/customer/payments/CustomerPayEmi"));
const CustomerPaymentSuccess = lazy(() => import("./pages/customer/payments/CustomerPaymentSuccess"));
const CustomerDocuments = lazy(() => import("./pages/customer/documents/CustomerDocuments"));
const CustomerNotifications = lazy(() => import("./pages/customer/notifications/CustomerNotifications"));
const CustomerProfile = lazy(() => import("./pages/customer/profile/CustomerProfile"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<RouteLoader />}>
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
              <Route path="/customer/apply" element={<CustomerCompleteApplication />} />
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
      </Suspense>
    </Router>
  );
}
