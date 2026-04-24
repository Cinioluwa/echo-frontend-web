import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAuthStore } from "../stores";
import {
  AuthLayout,
  AuthCard,
  AuthButton,
  AuthInput,
  // GoogleButton, // COMMENTED OUT: Google auth not implemented yet
  OfflineIndicator,
} from "../components/auth";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import { useNetworkStatus } from "../hooks";
import { getErrorMessage } from "../utils/networkUtils";
import { validateLoginForm } from "../utils/validationUtils";
import type { User } from "../api/types";

// Email and password icons (orange/gold color matching Figma)
const EmailIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.333 6.5c0-.92.746-1.667 1.667-1.667h14c.92 0 1.667.746 1.667 1.667v13c0 .92-.746 1.667-1.667 1.667H6A1.667 1.667 0 0 1 4.333 19.5v-13Z"
      stroke="#ffc37b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m4.333 6.5 8.667 6.5 8.667-6.5"
      stroke="#ffc37b"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PasswordIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="5"
      y="11"
      width="16"
      height="10"
      rx="2"
      stroke="#ffc37b"
      strokeWidth="2"
    />
    <path
      d="M8 11V8a5 5 0 0 1 10 0v3"
      stroke="#ffc37b"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="13" cy="16" r="1.5" fill="#ffc37b" />
  </svg>
);

/**
 * Login Component
 * User login screen with email/password and Google OAuth
 * Implements smart routing based on user status after successful login
 *
 * Design: Figma Desktop (3753:8252) | Mobile (3835:11391)
 *
 * Routing Logic:
 * - ACTIVE + organizationId → /stream (main feed)
 * - PENDING + pendingRequests → /waiting-room (approval pending)
 * - No organizationId → /find-institution (needs org selection)
 * - PENDING without requests → /verification (email verification needed)
 */
const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const { isOffline } = useNetworkStatus();

  // Set page title
  usePageTitle();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (error) setError(null);
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Smart routing logic based on user status
   * Determines the appropriate page to redirect user after login
   */
  const redirectUser = (user: User) => {
    console.log("redirectUser called with:", { role: user.role, status: user.status, orgId: user.organizationId });

    // Admin users - go to admin feed
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      console.log("→ Redirecting to /admin/feed (ADMIN)");
      navigate("/admin/feed");
      return;
    }

    const pendingJoinRequest =
      user.pendingJoinRequest?.status === "PENDING"
        ? user.pendingJoinRequest
        : null;
    const legacyPendingRequest =
      user.pendingRequests?.find((request) => request.status === "PENDING") ||
      null;

    // Pending user with pending approval requests - go to waiting room
    if (pendingJoinRequest || legacyPendingRequest) {
      console.log("→ Redirecting to /waiting-room (pending approval)");
      navigate("/waiting-room", {
        state: {
          organizationName:
            pendingJoinRequest?.organization?.name ||
            legacyPendingRequest?.organizationName ||
            user.organization?.name ||
            "your organization",
        },
      });
      return;
    }

    // Active user with organization - go to main feed (or from location)
    if (user.status === "ACTIVE" && user.organizationId) {
      console.log("→ Redirecting to /feed (ACTIVE user)");
      const from = location.state?.from?.pathname + (location.state?.from?.search || "");
      if (from && from !== "/login") {
        navigate(from);
      } else {
        navigate("/feed");
      }
      return;
    }

    // User without organization - needs to find institution
    if (!user.organizationId) {
      console.log("→ Redirecting to /find-institution (no org)");
      navigate("/find-institution");
      return;
    }

    // Pending user without organization requests - needs email verification
    if (user.status === "PENDING") {
      console.log("→ Redirecting to /verification (PENDING)");
      navigate("/verification", { state: { email: user.email } });
      return;
    }

    // Default fallback - keep user in verification flow until status is known
    console.log("→ Redirecting to /verification (fallback)");
    navigate("/verification", { state: { email: user.email } });
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Check if offline
    if (isOffline) {
      setError("No internet connection. Please check your network and try again.");
      return;
    }

    // Validate form
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Use the auth store's login method
      await login(formData);

      // Get the user from the store after successful login
      const user = useAuthStore.getState().user;

      console.log("After login, user from store:", user ? `${user.email} (${user.role})` : "null");

      if (user) {
        console.log("Redirecting user with role:", user.role);
        redirectUser(user);
      } else {
        console.warn("No user data after login, redirecting to verification");
        navigate("/verification", { state: { email: formData.email } });
      }
    } catch (err: any) {
      console.error("Login error:", err);

      const status = err?.response?.status;
      const data = err?.response?.data;

      // Handle different error scenarios with improved messaging
      if (status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (status === 403 && data?.code === "ACCOUNT_PENDING_VERIFICATION") {
        navigate("/verification", { state: {email: formData.email}});
      } else if (status === 400 && data?.code === "GOOGLE_AUTH_REQUIRED") {
        setError("This account uses Google Sign-In. Please use 'Continue with Google'.");
      } else if (status === 404 && data?.code === "ORG_NOT_FOUND") {
        setError("No organization found for this email domain.");
      } else {
        // Use network utility for better error messaging
        const errorMessage = getErrorMessage(err);
        setError(data?.error || data?.message || errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // COMMENTED OUT: Google auth not implemented yet
  // const handleGoogleLogin = () => {
  //   // TODO: Implement Google OAuth flow
  //   setError("Google Sign-In is not configured yet.");
  // };

  return (
    <>
      <OfflineIndicator />
      <AuthLayout>
        <AuthCard>
          {/* Header Section */}
          <div className="flex flex-col gap-2.5 items-center text-center w-full">
            <h1
              className="text-[22px] sm:text-[26px] md:text-[28px] leading-7 sm:leading-8 md:leading-9 text-black"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
            >
              Enter the Pulse
            </h1>
            <p
              className="text-[14px] sm:text-base leading-5 sm:leading-[21px] text-[#4a504e] opacity-[0.69]"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
            >
              Pick up where you left off at your institution
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Form Section */}
          <form onSubmit={handleSubmitLogin} className="w-full flex flex-col gap-5 sm:gap-6 md:gap-[30px] items-center">
            {/* Input Fields */}
            <div className="flex flex-col gap-3.5 sm:gap-4 md:gap-5 items-start w-full">
              {/* COMMENTED OUT: Google OAuth Button - not implemented yet */}
              {/* <GoogleButton
                onClick={handleGoogleLogin}
                disabled={loading}
                text="Continue with Google"
              /> */}

              {/* Email Input */}
              <AuthInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter Email..."
                required
                disabled={loading || isOffline}
                icon={<EmailIcon />}
                autoComplete="email"
                error={validationErrors.email}
                className="w-full"
              />

              {/* Password Input */}
              <AuthInput
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter" && !loading && !isOffline) {
                    handleSubmitLogin(e as any);
                  }
                }}
                placeholder="Enter Password..."
                required
                disabled={loading || isOffline}
                icon={<PasswordIcon />}
                autoComplete="current-password"
                error={validationErrors.password}
                className="w-full"
                showPasswordToggle
              />

              {/* Forgot Password Link */}
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(true)}
                className="text-xs sm:text-sm text-[#f49b31] hover:text-[#e08a2a] transition-colors font-medium self-end"
                style={{ fontFamily: "Poppins, sans-serif" }}
                disabled={loading || isOffline}
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <AuthButton
              type="submit"
              disabled={loading || isOffline}
              loading={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Log in"}
            </AuthButton>
          </form>

          {/* Footer Section */}
          <div className="flex flex-col gap-4 sm:gap-5 items-center px-3 sm:px-5 w-full">
            {/* Terms and Privacy */}
            <div
              className="flex flex-col gap-3 sm:gap-[15px] items-center text-center text-xs sm:text-sm leading-3.5"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
            >
              <p className="text-[#838383]">By creating an account, you agree to Echo</p>
              <Link
                to="/terms"
                className="text-[#f49b31] hover:text-[#e08a2a] transition-colors"
              >
                Terms of Use, Privacy Policy
              </Link>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#e0e0e0]" />

            {/* Sign Up Link */}
            <div
              className="text-center text-xs sm:text-sm"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
            >
              <span className="text-[#838383]">Don't have an account? </span>
              <Link
                to="/signUp"
                className="text-[#f49b31] hover:text-[#e08a2a] transition-colors cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal isOpen={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />
    </>
  );
};

export default Login;
