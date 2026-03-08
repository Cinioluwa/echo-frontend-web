import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
import {
  AuthLayout,
  AuthCard,
  AuthButton,
  AuthInput,
  GoogleButton,
} from "../components/auth";
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
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  /**
   * Smart routing logic based on user status
   * Determines the appropriate page to redirect user after login
   */
  const redirectUser = (user: User) => {
    // Active user with organization - go to main feed
    if (user.status === "ACTIVE" && user.organizationId) {
      navigate("/stream");
      return;
    }

    // Pending user with pending approval requests - go to waiting room
    if (user.status === "PENDING" && user.pendingRequests && user.pendingRequests.length > 0) {
      navigate("/waiting-room");
      return;
    }

    // User without organization - needs to find institution
    if (!user.organizationId) {
      navigate("/find-institution");
      return;
    }

    // Pending user without organization requests - needs email verification
    if (user.status === "PENDING") {
      navigate("/verification", { state: { email: user.email } });
      return;
    }

    // Default fallback - go to stream
    navigate("/stream");
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Use the auth store's login method
      await login(formData);

      // Get the user from the store after successful login
      const user = useAuthStore.getState().user;

      if (user) {
        redirectUser(user);
      } else {
        // If no user data in response, go to default route
        navigate("/stream");
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      // Handle different error scenarios
      if (status === 401) {
        setError("Invalid email or password");
      } else if (status === 403 && data?.code === "ACCOUNT_PENDING_VERIFICATION") {
        setError("Please verify your email before logging in");
      } else if (status === 400 && data?.code === "GOOGLE_AUTH_REQUIRED") {
        setError("This account uses Google Sign-In. Please use 'Continue with Google'.");
      } else if (status === 404 && data?.code === "ORG_NOT_FOUND") {
        setError("No organization found for this email domain");
      } else {
        setError(data?.error || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth flow
    setError("Google Sign-In is not configured yet.");
  };

  return (
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
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-[30px] items-center w-full">
          {/* Input Fields */}
          <div className="flex flex-col gap-3.5 sm:gap-4 md:gap-5 items-start w-full">
            {/* Google OAuth Button */}
            <GoogleButton
              onClick={handleGoogleLogin}
              disabled={loading}
              text="Continue with Google"
            />

            {/* Email Input */}
            <AuthInput
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email..."
              required
              disabled={loading}
              icon={<EmailIcon />}
              autoComplete="email"
            />

            {/* Password Input */}
            <AuthInput
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter Password..."
              required
              disabled={loading}
              icon={<PasswordIcon />}
              autoComplete="current-password"
            />
          </div>

          {/* Submit Button */}
          <form onSubmit={handleSubmitLogin} className="w-full">
            <AuthButton
              type="submit"
              disabled={loading}
              loading={loading}
              fullWidth
            >
              {loading ? "Logging in..." : "Log in"}
            </AuthButton>
          </form>
        </div>

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
  );
};

export default Login;
