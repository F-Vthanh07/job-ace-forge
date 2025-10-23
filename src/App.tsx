import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
import EnterpriseSignup from "./pages/EnterpriseSignup";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";
import Candidates from "./pages/Candidates";
import CandidateReport from "./pages/CandidateReport";
import EnterprisePayment from "./pages/EnterprisePayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
          <Route path="/enterprise-signup" element={<EnterpriseSignup />} />
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/candidate-report/:id" element={<CandidateReport />} />
          <Route path="/enterprise-payment" element={<EnterprisePayment />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
