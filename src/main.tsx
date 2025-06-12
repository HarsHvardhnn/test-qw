import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { ProjectProvider as ProjectProvider } from "./contractor/context/ProjectContext";
import { ProjectProvider as CustomerProjectProvider } from "./customer/context/ProjectContext";
import App from "./App";
import { TestMeetingEntry } from "./standalone/TestMeetingEntry";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import Toast styles
import { StakeholderDashboard } from "./stakeholder/StakeholderDashboard";
import { CustomerDashboard } from "./customer/CustomerDashboard";
import { ContractorDashboard } from "./contractor/ContractorDashboard";
import { VendorDashboard } from "./vendor/VendorDashboard";
import Login from "./components/onboarding/Login";
import "./index.css";
import AccountForm1 from "./components/onboarding/AccountForm1";
import AccountForm2 from "./components/onboarding/AccountForm2";
import OtpVerification from "./components/onboarding/OtpVerification";
import { LoaderProvider } from "./context/LoaderContext";
import { ConversationProvider } from "./customer/context/ConversationContext";
import ForgotPassword from "./components/onboarding/ForgetPassword";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/landingpage",
    element: <App />,
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  // {
  //   path: '/account-form1',
  //   element: <AccountForm1 />
  // },
  // {
  //   path: '/account-form2',
  //   element: <AccountForm2 />
  // },
  {
    path: "/meeting/:id",
    element: (
      <CustomerProjectProvider projectId="">
        <ProjectProvider>
          <TestMeetingEntry />
        </ProjectProvider>
      </CustomerProjectProvider>
    ),
  },
  {
    path: "/stakeholder",
    element: <StakeholderDashboard />,
  },
  {
    path: "/customer",
    element: <CustomerDashboard />,
  },
  {
    path: "/contractor",
    element: (
      <ProjectProvider>
        <ContractorDashboard />
      </ProjectProvider>
    ),
  },
  {
    path: "/vendor",
    element: <VendorDashboard />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <AccountForm1 />,
  },
  {
    path: "/register2",
    element: <AccountForm2 />,
  },
  {
    path: "/otpverification",
    element: <OtpVerification />,
  },
  {
    path: "/forget-password",
    element: <ForgotPassword />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoaderProvider>
      <UserProvider>
        <ConversationProvider>
          <RouterProvider router={router} />
          <ToastContainer
            toastClassName="center-toast"
            autoClose={3000}
            hideProgressBar
            closeButton={false}
            newestOnTop
          />

          {/* ✅ Add ToastContainer here */}
        </ConversationProvider>
      </UserProvider>
    </LoaderProvider>
  </StrictMode>
);
