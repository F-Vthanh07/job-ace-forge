import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";
import BusinessChoice from "./pages/BusinessChoice";
import JoinExistingCompany from "./pages/JoinExistingCompany";
import RegisterNewCompany from "./pages/RegisterNewCompany";
import AwaitingApproval from "./pages/AwaitingApproval";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import CVManager from "./pages/CVManager";
import CVBuilder from "./pages/CVBuilder";
import CVFeedback from "./pages/CVFeedback";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewSession from "./pages/InterviewSession";
import InterviewReport from "./pages/InterviewReport";
import SkillProgress from "./pages/SkillProgress";
import Resources from "./pages/Resources";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Premium from "./pages/Premium";
import Payment from "./pages/Payment";
import RecruiterLogin from "./pages/RecruiterLogin";
import RecruiterSignup from "./pages/RecruiterSignup";
import BusinessProfile from "./pages/BusinessProfile";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import EditJob from "./pages/EditJob";
import ManageJobs from "./pages/ManageJobs";
import RecruiterPremium from "./pages/RecruiterPremium";
import Candidates from "./pages/Candidates";
import CandidateReport from "./pages/CandidateReport";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminBusinesses from "./pages/AdminBusinesses";
import AdminPricing from "./pages/AdminPricing";
import AdminReports from "./pages/AdminReports";
import EnterpriseSignup from "./pages/EnterpriseSignup";
import EnterprisePayment from "./pages/EnterprisePayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Welcome />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/business-choice" element={<BusinessChoice />} />
              <Route path="/join-existing-company" element={<JoinExistingCompany />} />
              <Route path="/register-new-company" element={<RegisterNewCompany />} />
              <Route path="/awaiting-approval" element={<AwaitingApproval />} />
              <Route path="/onboarding" element={<Onboarding />} />
              
              {/* Candidate Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cv-manager" element={<CVManager />} />
              <Route path="/cv-builder" element={<CVBuilder />} />
              <Route path="/cv-feedback/:id" element={<CVFeedback />} />
              <Route path="/interview-setup" element={<InterviewSetup />} />
              <Route path="/interview-session" element={<InterviewSession />} />
              <Route path="/interview-report/:id" element={<InterviewReport />} />
              <Route path="/skill-progress" element={<SkillProgress />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/job-detail/:id" element={<JobDetail />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/payment" element={<Payment />} />
              
              {/* Recruiter Routes */}
              <Route path="/recruiter-login" element={<RecruiterLogin />} />
              <Route path="/recruiter-signup" element={<RecruiterSignup />} />
              <Route path="/business-profile" element={<BusinessProfile />} />
              <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/edit-job/:jobId" element={<EditJob />} />
              <Route path="/manage-jobs" element={<ManageJobs />} />
              <Route path="/recruiter-premium" element={<RecruiterPremium />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidate-report/:id" element={<CandidateReport />} />
              <Route path="/enterprise-signup" element={<EnterpriseSignup />} />
              <Route path="/enterprise-payment" element={<EnterprisePayment />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/businesses" element={<AdminBusinesses />} />
              <Route path="/admin/pricing" element={<AdminPricing />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
