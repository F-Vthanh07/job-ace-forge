/**
 * Notification Examples
 * This file contains common notification patterns used throughout the application
 */

import { 
  notifySuccess, 
  notifyError, 
  notifyWarning, 
  notifyInfo,
  notifyAuthSuccess,
  notifyLoginRequired,
  notifyPermissionDenied,
  notifyActionComplete,
  notifyNetworkError
} from './notification';

// ===== AUTHENTICATION =====

export const showLoginSuccess = (userName?: string) => {
  notifyAuthSuccess(userName);
};

export const showLogoutSuccess = () => {
  notifySuccess({
    title: "Logged Out",
    description: "You have been successfully logged out"
  });
};

export const showSignupSuccess = () => {
  notifySuccess({
    title: "Account Created",
    description: "Welcome! Your account has been created successfully",
    duration: 4
  });
};

export const showLoginRequired = () => {
  notifyLoginRequired();
};

export const showSessionExpired = () => {
  notifyWarning({
    title: "Session Expired",
    description: "Please log in again to continue",
    action: {
      label: "Log In",
      onClick: () => globalThis.location.href = '/login'
    }
  });
};

// ===== DATA OPERATIONS =====

export const showDataSaved = (itemName: string = "Data") => {
  notifyActionComplete(`${itemName} saved`);
};

export const showDataDeleted = (itemName: string = "Item") => {
  notifySuccess({
    title: "Deleted",
    description: `${itemName} has been removed`
  });
};

export const showDataUpdated = (itemName: string = "Data") => {
  notifySuccess({
    title: "Updated",
    description: `${itemName} has been updated successfully`
  });
};

// ===== FORM VALIDATION =====

export const showValidationError = (message: string) => {
  notifyWarning({
    title: "Validation Error",
    description: message
  });
};

export const showRequiredFields = () => {
  notifyWarning({
    title: "Missing Information",
    description: "Please fill in all required fields"
  });
};

// ===== FILE OPERATIONS =====

export const showFileUploaded = (fileName?: string) => {
  notifySuccess({
    title: "Upload Complete",
    description: fileName ? `${fileName} uploaded successfully` : "File uploaded successfully"
  });
};

export const showFileUploadError = () => {
  notifyError("File upload failed. Please try again", "Upload Error");
};

export const showFileSizeError = (maxSize: string = "5MB") => {
  notifyWarning({
    title: "File Too Large",
    description: `Please upload a file smaller than ${maxSize}`
  });
};

// ===== PERMISSION & ACCESS =====

export const showNoPermission = () => {
  notifyPermissionDenied();
};

export const showAccessDenied = (reason?: string) => {
  notifyPermissionDenied(reason || "You don't have access to this resource");
};

// ===== NETWORK & API =====

export const showNetworkError = () => {
  notifyNetworkError();
};

export const showApiError = (message?: string) => {
  notifyError(
    message || "Something went wrong. Please try again",
    "Error"
  );
};

export const showServerError = () => {
  notifyError(
    "Server error occurred. Our team has been notified",
    "Server Error"
  );
};

// ===== JOB APPLICATION =====

export const showApplicationSubmitted = () => {
  notifySuccess({
    title: "Application Submitted",
    description: "Your application has been sent successfully"
  });
};

export const showApplicationSaved = () => {
  notifySuccess({
    title: "Saved as Draft",
    description: "You can continue later from your profile"
  });
};

// ===== CV/RESUME =====

export const showCVGenerated = () => {
  notifyActionComplete("CV generated");
};

export const showCVExported = (format: string = "PDF") => {
  notifySuccess({
    title: "Export Complete",
    description: `Your CV has been exported as ${format}`
  });
};

// ===== SUBSCRIPTION =====

export const showSubscriptionActivated = (planName: string) => {
  notifySuccess({
    title: "Subscription Active",
    description: `${planName} plan is now active. Enjoy premium features!`,
    duration: 5
  });
};

export const showPaymentSuccess = () => {
  notifySuccess({
    title: "Payment Successful",
    description: "Thank you for your purchase"
  });
};

export const showPaymentFailed = () => {
  notifyError(
    "Payment failed. Please try again or contact support",
    "Payment Failed"
  );
};

// ===== PROFILE & SETTINGS =====

export const showProfileUpdated = () => {
  notifyActionComplete("Profile updated");
};

export const showPasswordChanged = () => {
  notifySuccess({
    title: "Password Changed",
    description: "Your password has been updated successfully"
  });
};

export const showEmailVerificationSent = () => {
  notifyInfo({
    title: "Verification Email Sent",
    description: "Please check your inbox and verify your email"
  });
};

// ===== INTERVIEW =====

export const showInterviewScheduled = () => {
  notifySuccess({
    title: "Interview Scheduled",
    description: "You'll receive a confirmation email shortly"
  });
};

export const showInterviewCancelled = () => {
  notifyInfo({
    title: "Interview Cancelled",
    description: "The interview has been cancelled"
  });
};

// ===== GENERAL INFO =====

export const showComingSoon = (feature: string = "This feature") => {
  notifyInfo({
    title: "Coming Soon",
    description: `${feature} will be available soon`
  });
};

export const showMaintenanceMode = () => {
  notifyWarning({
    title: "Under Maintenance",
    description: "This feature is currently under maintenance. Please try again later"
  });
};

export const showCopiedToClipboard = () => {
  notifySuccess({
    title: "Copied",
    description: "Copied to clipboard"
  });
};
