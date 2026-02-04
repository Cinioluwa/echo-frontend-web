import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores";
const password = "/assets/images/Password.svg";
const email = "/assets/images/Email.svg";
const backgroundImage = "/assets/images/backgroundImage.jpg";
const logo = "/assets/images/Echo Logo.svg";
import InputGroup from "../components/InputGroup";
import authService from "../api/services/auth.service";

const MobileSignUp = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  async function handleSubmitSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await authService.signup(formData);

      // Check if email verification is required
      if (response.message.includes("verify your email")) {
        setSuccess("Account created! Please check your email to verify your account.");
        // Clear form
        setFormData({
          email: "",
          password: "",
          firstName: "",
          lastName: "",
        });
      } else if (response.token) {
        // If token is returned, user is auto-logged in
        await login(response.token);
        setSuccess("Account created successfully!");
        setTimeout(() => navigate("/stream"), 1500);
      }
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      if (status === 409 && data?.code === "ACCOUNT_EXISTS") {
        setError("An account with this email already exists");
      } else if (status === 404 && data?.code === "ORG_NOT_FOUND") {
        setError("No organization found for this email domain. Please contact your administrator.");
      } else if (status === 400) {
        setError(data?.error || "Invalid registration data. Please check all fields.");
      } else {
        setError(data?.error || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="h-screen bg-cover  bg-no-repeat bg-center gap-[50px] flex flex-col  md:block overflow-x-hidden"
    >
      <header>
        <img
          className=" mx-auto md:mb-12 mt-[43px] md:mt-[30px] md:ml-16 contrast-200"
          src={logo}
          alt="Echo Logo"
        />
      </header>
      {/* Mobile Sign Up page */}
      <main className="   flex   items-center justify-center">
        {/* Sign Up container */}
        <div className="p-[38px] md:flex  bg-white  gap-8 rounded-4xl">
          <div className="flex flex-col  mx-2.5 md:mx-0 items-center mt-[70px] justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl ">
              Echo: Your Voice at CU
            </span>
            <p className="block font-normal mt-[15px] mb-[15px] text-1xl text-center text-[#838383]">
              Create waves, rally support, track change
            </p>

            {error && (
              <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {success && (
              <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm text-center">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmitSignUp} className="flex flex-col justify-center items-center mb-8 w-full">
              <p className="hidden   justify-center gap-3 mt-4 mb-20 text-[#838383]">
                <span className="w-7 pr-2 py-1  inline-flex items-center justify-center border-r border-r-[#CACACA]">
                  <img src={email} alt="" />
                </span>
                Sign up with Email
              </p>
              <div className="mt-5 mb-[15px] w-full">
                <InputGroup
                  type="text"
                  name="firstName"
                  iconSrc={email}
                  placeholder="First Name..."
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <InputGroup
                  type="text"
                  name="lastName"
                  iconSrc={email}
                  placeholder="Last Name..."
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <InputGroup
                  type="email"
                  name="email"
                  iconSrc={email}
                  placeholder="Enter email..."
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <InputGroup
                  type="password"
                  name="password"
                  iconSrc={password}
                  placeholder="Enter password..."
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className=" flex items-center justify-center px-20 py-[7px] whitespace-nowrap  text-white  h-8 cursor-pointer bg-[#F49B31] rounded-[9px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
              <div className="flex items-center my-[30px] text-[#ACAAAA] justify-center gap-[5px] md:hidden">
                <img src={email} alt="" />
                Sign up with email
              </div>
            </form>
            <p className="text-[#838383] text-center text-[14px]">
              By creating an account, you agree to Echo
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>
            </span>
            <div className=" mb-5 md:mb-5 pt-[30px] border-t border-[#D3CECE] mt-10 self-end w-full">
              <p className="text-center text-[#838383] ">
                Already have an account?
                <Link
                  to="/"
                  className="pl-1 text-[#F49B31] whitespace-nowrap cursor-pointer"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileSignUp;
