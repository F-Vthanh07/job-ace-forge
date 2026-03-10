# Enhanced Notification System

## Overview
Professional, user-friendly notification system with beautiful animations and customizable actions.

## Features
✨ **Beautiful Design** - Modern UI with smooth animations  
🎨 **Multiple Variants** - Success, Error, Warning, Info  
🎯 **Smart Icons** - Context-aware icons for each notification type  
⚡ **Action Buttons** - Add clickable actions to notifications  
🌗 **Dark Mode** - Fully supports light and dark themes  
📱 **Responsive** - Works great on all screen sizes  

---

## Basic Usage

### Import
```typescript
import { 
  notifySuccess, 
  notifyError, 
  notifyWarning, 
  notifyInfo 
} from '@/utils/notification';
```

### Success Notification
```typescript
// Simple message
notifySuccess("Operation completed successfully");

// With custom title and description
notifySuccess({
  title: "Success",
  description: "Your changes have been saved",
  duration: 4
});

// With action button
notifySuccess({
  title: "Profile Updated",
  description: "Your profile has been updated successfully",
  action: {
    label: "View Profile",
    onClick: () => navigate('/profile')
  }
});
```

### Error Notification
```typescript
// Simple error
notifyError("Something went wrong");

// With custom title
notifyError("Invalid email format", "Validation Error");

// With action button
notifyError("Failed to save changes", "Error", {
  label: "Retry",
  onClick: () => saveChanges()
});
```

### Warning Notification
```typescript
notifyWarning({
  title: "Warning",
  description: "This action cannot be undone"
});
```

### Info Notification
```typescript
notifyInfo({
  title: "Information",
  description: "New features are available"
});
```

---

## Special Notification Helpers

### Authentication
```typescript
import { 
  notifyAuthSuccess, 
  notifyLoginRequired, 
  notifyPermissionDenied 
} from '@/utils/notification';

// Success login with personalized greeting
notifyAuthSuccess("John Doe");

// Login required
notifyLoginRequired();

// Access denied
notifyPermissionDenied("You need admin privileges");
```

### Actions
```typescript
import { 
  notifyActionComplete, 
  notifyNetworkError 
} from '@/utils/notification';

// Action completed
notifyActionComplete("Profile updated");

// Network error
notifyNetworkError();
```

---

## Using Notification Examples

For common scenarios, use pre-built examples:

```typescript
import { 
  showLoginSuccess,
  showDataSaved,
  showFileUploaded,
  showApplicationSubmitted
} from '@/utils/notificationExamples';

// Authentication
showLoginSuccess("John Doe");
showLogoutSuccess();
showSignupSuccess();

// Data operations
showDataSaved("Profile");
showDataUpdated("Settings");
showDataDeleted("Document");

// File operations
showFileUploaded("resume.pdf");
showFileSizeError("10MB");

// Validation
showValidationError("Password must be at least 8 characters");
showRequiredFields();

// Job applications
showApplicationSubmitted();
showApplicationSaved();

// CV/Resume
showCVGenerated();
showCVExported("PDF");

// Subscription
showSubscriptionActivated("Premium");
showPaymentSuccess();

// Profile
showProfileUpdated();
showPasswordChanged();
showEmailVerificationSent();

// Interview
showInterviewScheduled();
showInterviewCancelled();

// General
showComingSoon("Chat feature");
showCopiedToClipboard();
```

---

## Configuration

### Global Settings
Notifications are configured globally in `notification.ts`:

```typescript
notification.config({
  placement: "topRight",  // Position
  top: 24,                // Distance from top
  duration: 4.5,          // Default duration (seconds)
  maxCount: 3,            // Max visible notifications
});
```

### Custom Duration
```typescript
notifySuccess({
  title: "Success",
  description: "Operation completed",
  duration: 10  // Show for 10 seconds
});
```

---

## Styling

### Custom Styles
Notifications are styled in `index.css`:

```css
/* Customize notification appearance */
.ant-notification-notice {
  padding: 16px 24px !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
  backdrop-filter: blur(10px) !important;
}
```

### Dark Mode
Dark mode is automatically supported. Notifications adapt to the current theme.

---

## Best Practices

### ✅ Do's
- Use concise, friendly messages
- Provide actionable feedback
- Use appropriate notification types
- Add action buttons when helpful
- Keep descriptions short (1-2 lines max)

### ❌ Don'ts
- Don't show too many notifications at once
- Don't use technical jargon
- Don't make notifications too long
- Don't duplicate information
- Don't overuse notifications

---

## Examples by Scenario

### Form Submission
```typescript
try {
  await submitForm(data);
  notifySuccess({
    title: "Submitted",
    description: "Your form has been submitted successfully"
  });
} catch (error) {
  notifyError(error, "Submission Failed");
}
```

### Data Loading
```typescript
try {
  const data = await fetchData();
  // Success - no notification needed for successful loads
} catch (error) {
  notifyNetworkError();
}
```

### User Actions
```typescript
const handleDelete = async () => {
  try {
    await deleteItem(id);
    notifyActionComplete("Item deleted");
    navigate('/items');
  } catch (error) {
    notifyError(error, "Delete Failed", {
      label: "Retry",
      onClick: handleDelete
    });
  }
};
```

### Validation
```typescript
if (!email) {
  notifyWarning({
    title: "Missing Email",
    description: "Please enter your email address"
  });
  return;
}

if (!email.includes('@')) {
  notifyWarning({
    title: "Invalid Email",
    description: "Please enter a valid email address"
  });
  return;
}
```

---

## Migration from Old Toast System

### Before (shadcn/ui toast)
```typescript
import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Success",
  description: "Operation completed",
  variant: "default"
});
```

### After (Enhanced Notification)
```typescript
import { notifySuccess } from "@/utils/notification";

notifySuccess({
  title: "Success",
  description: "Operation completed"
});
```

---

## Troubleshooting

### Notifications not showing
1. Check if antd is properly installed
2. Verify notification.ts is imported correctly
3. Check browser console for errors

### Styling issues
1. Ensure index.css is loaded
2. Check for CSS conflicts
3. Verify Tailwind is configured

### Dark mode not working
1. Check theme provider is set up
2. Verify CSS variables are defined
3. Test with manual theme toggle

---

## Support

For issues or questions:
1. Check this documentation
2. Review notification.ts implementation
3. See notificationExamples.ts for common patterns
4. Contact the development team

---

**Last Updated:** March 10, 2026
**Version:** 1.0.0
