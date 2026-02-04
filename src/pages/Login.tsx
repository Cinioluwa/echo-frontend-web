import { useState } from "react";
const google = "/assets/images/Google (2).svg";
const password = "/assets/images/Password.svg";
const email = "/assets/images/Email.svg";
const backgroundImage = "/assets/images/backgroundImage.jpg";
const logo = "/assets/images/Echo Logo.svg";
const echo = "/assets/images/Echo.svg";
import InputGroup from "../components/InputGroup";
import { Link, useNavigate } from "react-router-dom";
import authService from "../api/services/auth.service";
import { useAuthStore } from "../stores";

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
    if (error) setError(null);
  };

  async function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login(formData);
      await login(response.token);
      navigate("/soundBoard");
    } catch (err: any) {
      const status = err?.response?.status;
      const data = err?.response?.data;

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
  }

  function handleGoogleLogin() {
    setError("Google Sign-In is not configured yet.");
  }

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="h-screen bg-cover overflow-y bg-no-repeat bg-center gap-[25px] flex flex-col p-2.5 md:block overflow-x-hidden"
    >
      <header>
        <img
          className="mx-auto md:mb-[15px] mt-5 md:mt-2.5 md:ml-16 contrast-200"
          src={logo}
          alt="Echo Logo"
        />
      </header>
      <main className="flex items-center h-[calc(100vh - 42.99px)] justify-center">
        <div className="p-7 md:flex bg-white md:p-4 gap-8 rounded-4xl">
          <div className="bg-[#FFC37B] hidden rounded-2xl md:flex flex-col justify-center items-center px-16 py-10 lg:py-10">
            <span className="block whitespace-nowrap font-bold text-2xl mb-4.5">
              Bridge Gap Between
            </span>
            <span className="block font-semibold text-[26px] xl mb-8">
              Students{" "}
              <span className="block text-center text-[26px]">and</span>
            </span>

            <img src={echo} alt="Echo" />
            <span className="block mt-8 font-bold text-2xl mb-4.5">
              Management
            </span>
          </div>

          <div className="flex flex-col md:mr-[15px] mx-2.5 md:mx-0 items-center md:mt-5 justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl">
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

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex cursor-pointer w-full my-4 h-16 items-center justify-center gap-1 rounded-xl bg-[#F49B31] py-1 md:py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white overflow-hidden">
                <img src={google} alt="Google logo" />
              </span>
              <p className="text-white">Continue with Google</p>
            </button>

            <form
              onSubmit={handleSubmitLogin}
              className="flex w-full flex-col justify-center items-center mb-8"
            >
              <div className="w-full">
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
                className="w-full py-[30px] whitespace-nowrap flex items-center justify-center text-white h-8 cursor-pointer bg-[#F49B31] rounded-[9px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="text-[#838383] text-center text-[14px]">
              By Logging into an account, you agree to Echo
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>
            </span>
            <div className="mb-2.5 md:mb-5 pt-5 border-t border-[#D3CECE] mt-5 self-end w-full">
              <p className="text-center text-[#838383]">
                Don't have an account?
                <Link
                  to="/signUp"
                  className="pl-1 text-[#F49B31] whitespace-nowrap cursor-pointer"
                >
                  sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
