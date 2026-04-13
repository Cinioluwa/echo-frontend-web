import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuthStore, useRegistrationStore } from "../stores";
import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import AuthInput from "../components/auth/AuthInput";
import AuthButton from "../components/auth/AuthButton";
// import GoogleButton from "../components/auth/GoogleButton"; // COMMENTED OUT: Google auth not implemented yet
import AuthFooter from "../components/auth/AuthFooter";
import OfflineIndicator from "../components/auth/OfflineIndicator";
import { useNetworkStatus } from "../hooks";
import { getErrorMessage } from "../utils/networkUtils";
import { validateSignupForm, getPasswordStrength } from "../utils/validationUtils";

// Icons
const EmailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PasswordIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const UserIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * SignUp Component - Phase 2 Implementation
 * Primary signup flow with domain-based organization assignment
 * Figma: Desktop (3753:8485) | Mobile (3833:10754)
 */
const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const setRegistrationFormData = useRegistrationStore((state) => state.setFormData);
  const { isOffline } = useNetworkStatus();

  // Set page title
  usePageTitle();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }>({});

  // Password strength validation
  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordValid = passwordStrength.length && passwordStrength.hasNumber && passwordStrength.hasSpecial;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors on change
    if (error) setError(null);
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Check if email is from a consumer domain (gmail, yahoo, hotmail, etc.)
   * Consumer email domains require manual organization selection
   */
  const isConsumerEmailDomain = (email: string): boolean => {
    const consumerDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "protonmail.com",
      "fastmail.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();
    return domain ? consumerDomains.includes(domain) : false;
  };

  const handleEmailBlur = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setValidationErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
    }
  };

  async function handleSubmitSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Check if offline
    if (isOffline) {
      setError("No internet connection. Please check your network and try again.");
      return;
    }

    // Client-side validation using utilities
    const errors = validateSignupForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Check if user is using a consumer email domain
    // These require manual organization selection before registration
    if (isConsumerEmailDomain(formData.email)) {
      setRegistrationFormData(formData);
      navigate("/find-institution", {
        state: {
          email: formData.email,
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
          },
        },
      });
      return;
    }

    setLoading(true);

    try {
      // Save form data to registration store for potential fallback flow
      setRegistrationFormData(formData);

      await register(formData);

      // If successful, navigate to verification screen
      navigate("/verification", { state: { email: formData.email } });
    } catch (err: any) {
      console.error("Registration error:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;
      const code = data?.code;

      if (status === 409 && code === "ACCOUNT_EXISTS") {
        setError("An account with this email already exists. Try logging in instead.");
      } else if (status === 404 && code === "ORG_NOT_FOUND") {
        // No organization found - redirect to Find Institution
        navigate("/find-institution", {
          state: {
            email: formData.email,
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              password: formData.password,
            },
          },
        });
      } else if (status === 400 && code === "ORG_ID_REQUIRED_FOR_PERSONAL_EMAIL") {
        // Consumer email without organization - redirect to find institution
        navigate("/find-institution", {
          state: {
            email: formData.email,
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              password: formData.password,
            },
          },
        });
      } else if (status === 400) {
        setError(data?.error || data?.message || "Invalid registration data. Please check all fields.");
      } else {
        // Use network utility for better error messaging
        const errorMessage = getErrorMessage(err);
        setError(data?.error || data?.message || errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  // COMMENTED OUT: Google auth not implemented yet
  // function handleGoogleSignUp() {
  //   setError("Google Sign-Up is not configured yet.");
  // }

  return (
    <>
      <OfflineIndicator />
      <AuthLayout>
        <AuthCard>
          {/* Title */}
          <div className="text-center w-full">
            <h1
              className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-[#4a504e] mb-2.5"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Sign up to Echo
            </h1>
            <p
              className="text-[12px] sm:text-[13px] text-[#838383] font-normal"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              Create waves, rally support, track change
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full">
              <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            </div>
          )}

          {/* COMMENTED OUT: Google Sign Up Button - not implemented yet */}
          {/* <div className="w-full">
            <GoogleButton onClick={handleGoogleSignUp} disabled={loading || isOffline} loading={loading} />
          </div> */}

          {/* Divider */}
          <div className="w-full flex items-center gap-3 sm:gap-4">
            <div className="flex-1 h-px bg-[#e0e0e0]"></div>
            <span className="text-[12px] sm:text-[13px] text-[#838383] font-normal" style={{ fontFamily: 'Poppins, sans-serif' }}>
              or
            </span>
            <div className="flex-1 h-px bg-[#e0e0e0]"></div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmitSignUp} className="w-full flex flex-col gap-3.5 sm:gap-4 md:gap-5">
            {/* First Name */}
            <AuthInput
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="First Name..."
              icon={<UserIcon />}
              error={validationErrors.firstName}
              disabled={loading || isOffline}
              required
            />

            {/* Last Name */}
            <AuthInput
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Last Name..."
              icon={<UserIcon />}
              error={validationErrors.lastName}
              disabled={loading || isOffline}
              required
            />

            {/* Email */}
            <AuthInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleEmailBlur}
              placeholder="Email..."
              icon={<EmailIcon />}
              error={validationErrors.email}
              autoComplete="email"
              disabled={loading || isOffline}
              required
            />

            {/* Password */}
            <AuthInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter" && !loading && !isOffline && isPasswordValid) {
                  handleSubmitSignUp(e as any);
                }
              }}
              placeholder="Password..."
              icon={<PasswordIcon />}
              error={validationErrors.password}
              autoComplete="new-password"
              disabled={loading || isOffline}
              required
              showPasswordToggle
            />

            {/* Password Requirements */}
            {formData.password && (
              <div className="w-full bg-[#fef5ea] border border-[#ffcd71] rounded-xl px-3 sm:px-[15px] py-2.5 sm:py-3">
                <p
                  className="text-[10px] sm:text-[11px] font-medium text-[#4a504e] mb-1.5 sm:mb-2"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  Password must contain:
                </p>
                <ul className="space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={`text-[10px] ${passwordStrength.length ? 'text-green-600' : 'text-[#838383]'}`}>
                      {passwordStrength.length ? '✓' : '○'}
                    </span>
                    <span
                      className={`text-[10px] ${passwordStrength.length ? 'text-green-600 font-medium' : 'text-[#838383]'}`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      At least 8 characters
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`text-[10px] ${passwordStrength.hasNumber ? 'text-green-600' : 'text-[#838383]'}`}>
                      {passwordStrength.hasNumber ? '✓' : '○'}
                    </span>
                    <span
                      className={`text-[10px] ${passwordStrength.hasNumber ? 'text-green-600 font-medium' : 'text-[#838383]'}`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      At least one number
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={`text-[10px] ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-[#838383]'}`}>
                      {passwordStrength.hasSpecial ? '✓' : '○'}
                    </span>
                    <span
                      className={`text-[10px] ${passwordStrength.hasSpecial ? 'text-green-600 font-medium' : 'text-[#838383]'}`}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      At least one special character
                    </span>
                  </li>
                </ul>
              </div>
            )}

            {/* Submit Button */}
            <AuthButton type="submit" loading={loading} disabled={loading || isOffline || !isPasswordValid}>
              Sign up
            </AuthButton>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-[12px] sm:text-[13px] text-[#838383]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#f49b31] font-medium hover:underline">
                Log in
              </Link>
            </p>
          </div>

          {/* Footer */}
          <AuthFooter />
        </AuthCard>
      </AuthLayout>
    </>
  );
};

export default SignUp;
