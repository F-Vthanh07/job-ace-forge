import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService";
import { notifyWarning, notifyError, notifySuccess } from "@/utils/notification";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  password: string;
}

// Country codes for phone numbers
const countryCodes = [
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
];

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignupData, string>>>({});
  
  // Separate date fields
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  
  // Phone number parts
  const [countryCode, setCountryCode] = useState("+84");
  const [phoneWithoutCode, setPhoneWithoutCode] = useState("");

  useEffect(() => {
    // Initialize Turnstile widget
    const initTurnstile = async () => {
      if (turnstileRef.current) {
        await authService.renderTurnstile("turnstile-signup-container");
      }
    };
    initTurnstile();

    return () => {
      authService.removeTurnstile();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error when user starts typing
    if (errors[id as keyof SignupData]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }
  };

  // Handle date changes
  const handleDayChange = (value: string) => {
    setBirthDay(value);
    updateDateOfBirth(value, birthMonth, birthYear);
  };

  const handleMonthChange = (value: string) => {
    setBirthMonth(value);
    updateDateOfBirth(birthDay, value, birthYear);
  };

  const handleYearChange = (value: string) => {
    setBirthYear(value);
    updateDateOfBirth(birthDay, birthMonth, value);
  };

  const updateDateOfBirth = (day: string, month: string, year: string) => {
    if (day && month && year) {
      const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setFormData((prev) => ({
        ...prev,
        dateOfBirth: formattedDate,
      }));
      // Clear error when date is complete
      if (errors.dateOfBirth) {
        setErrors((prev) => ({
          ...prev,
          dateOfBirth: undefined,
        }));
      }
    }
  };

  // Handle phone number changes
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    setPhoneWithoutCode(value);
    setFormData((prev) => ({
      ...prev,
      phoneNumber: countryCode + value,
    }));
    // Clear error when user starts typing
    if (errors.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: undefined,
      }));
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value + phoneWithoutCode,
    }));
  };

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - 16 - i).toString());

  // Validation functions
  const validateFullName = (name: string): string | null => {
    if (!name || !name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Full name must be at least 2 characters";
    }
    if (name.length > 100) {
      return "Full name must not exceed 100 characters";
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(name)) {
      return "Full name can only contain letters and spaces";
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email || !email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Invalid email format (example: user@example.com)";
    }
    if (email.length > 100) {
      return "Email must not exceed 100 characters";
    }
    return null;
  };

  const validatePhoneNumber = (phone: string): string | null => {
    if (!phone || !phone.trim()) {
      return "Phone number is required";
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return "Phone number must have at least 10 digits";
    }
    if (cleanPhone.length > 11) {
      return "Phone number must not exceed 11 digits";
    }
    if (!/^(0|\+84)[0-9]{9,10}$/.test(phone.replace(/\s/g, ''))) {
      return "Invalid phone format (example: 0912345678)";
    }
    return null;
  };

  const validateDateOfBirth = (dob: string): string | null => {
    if (!dob || !dob.trim()) {
      return "Date of birth is required";
    }
    const date = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    
    if (isNaN(date.getTime())) {
      return "Invalid date format";
    }
    if (date > today) {
      return "Date of birth cannot be in the future";
    }
    if (age < 16) {
      return "You must be at least 16 years old";
    }
    if (age > 100) {
      return "Invalid date of birth";
    }
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password || !password.trim()) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    if (password.length > 50) {
      return "Password must not exceed 50 characters";
    }
    if (!/[A-Za-z]/.test(password)) {
      return "Password must contain at least one letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const validateGender = (gender: string): string | null => {
    if (!gender) {
      return "Gender is required";
    }
    return null;
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get Turnstile token
      const captchaToken = authService.getTurnstileToken();
      if (!captchaToken) {
        notifyWarning("Please complete the security verification");
        setLoading(false);
        return;
      }

      // Validate all fields
      const newErrors: Partial<Record<keyof SignupData, string>> = {};
      
      const fullNameError = validateFullName(formData.fullName);
      if (fullNameError) newErrors.fullName = fullNameError;

      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;

      const phoneError = validatePhoneNumber(formData.phoneNumber);
      if (phoneError) newErrors.phoneNumber = phoneError;

      const dobError = validateDateOfBirth(formData.dateOfBirth);
      if (dobError) newErrors.dateOfBirth = dobError;

      const genderError = validateGender(formData.gender);
      if (genderError) newErrors.gender = genderError;

      const passwordError = validatePassword(formData.password);
      if (passwordError) newErrors.password = passwordError;

      // If there are errors, show them
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        
        // Show toast with all errors
        const errorMessages = Object.values(newErrors);
        toast({
          title: "Validation Errors",
          description: (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {errorMessages.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          ),
          variant: "destructive",
        });
        
        authService.resetTurnstile();
        setLoading(false);
        return;
      }

      // All validations passed
      notifySuccess("Validation successful! Proceeding to role selection...");

      // Store signup data in sessionStorage for role selection page
      sessionStorage.setItem("signupData", JSON.stringify(formData));
      sessionStorage.setItem("signupCaptchaToken", captchaToken);
      
      // Navigate to role selection page
      navigate("/role-selection");
    } catch (error) {
      console.error("Signup error:", error);
      notifyError("An error occurred. Please try again.");
      authService.resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">AI JOBMATCH</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start your career transformation today</p>
        </div>

        <form className="space-y-4" onSubmit={handleNext}>
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              className={cn("mt-1", errors.fullName && "border-destructive")}
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
            />
            {errors.fullName && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.fullName}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className={cn("mt-1", errors.email && "border-destructive")}
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
            />
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <div className="flex gap-2 mt-1">
              <Select value={countryCode} onValueChange={handleCountryCodeChange} disabled={loading}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phoneNumberInput"
                type="tel"
                placeholder="912345678"
                className={cn("flex-1", errors.phoneNumber && "border-destructive")}
                value={phoneWithoutCode}
                onChange={handlePhoneChange}
                disabled={loading}
              />
            </div>
            {errors.phoneNumber && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.phoneNumber}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Example: {countryCode} 912345678
            </p>
          </div>

          <div>
            <Label>Date of Birth *</Label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <Select value={birthDay} onValueChange={handleDayChange} disabled={loading}>
                <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  {days.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={birthMonth} onValueChange={handleMonthChange} disabled={loading}>
                <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={birthYear} onValueChange={handleYearChange} disabled={loading}>
                <SelectTrigger className={cn(errors.dateOfBirth && "border-destructive")}>
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.dateOfBirth && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.dateOfBirth}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              You must be at least 16 years old
            </p>
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, gender: value }));
                if (errors.gender) {
                  setErrors((prev) => ({ ...prev, gender: undefined }));
                }
              }}
              disabled={loading}
            >
              <SelectTrigger className={cn("mt-1", errors.gender && "border-destructive")}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.gender}</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={cn("mt-1", errors.password && "border-destructive")}
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
            />
            {errors.password && (
              <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors.password}</span>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              At least 6 characters with letters and numbers
            </p>
          </div>

          {/* Turnstile Widget */}
          <div 
            ref={turnstileRef} 
            id="turnstile-signup-container" 
            className="flex justify-center my-4"
          />

          <Button 
            type="submit" 
            className="w-full gradient-primary shadow-glow" 
            size="lg"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Register"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
