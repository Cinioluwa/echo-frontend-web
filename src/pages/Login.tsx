import google from "../assets/images/Google (2).svg";
import password from "../assets/images/Password.svg";
import email from "../assets/images/Email.svg";
import backgroundImage from "../assets/images/backgroundImage.jpg";
import logo from "../assets/images/Echo Logo.svg";
import echo from "../assets/images/Echo.svg";
import InputGroup from "../components/InputGroup";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  function handleSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    navigate("/stream");
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
        />
      </header>
      {/* Login page */}
      <main className="flex items-center h-[calc(100vh - 42.99px)] justify-center">
        {/* Login container */}
        <div className="p-7 md:flex bg-white md:p-4 gap-8 rounded-4xl">
          <div className="bg-[#FFC37B] hidden  rounded-2xl md:flex flex-col justify-center items-center px-16 py-10 lg:py-10">
            <span className="block whitespace-nowrap font-bold text-2xl mb-4.5">
              Bridge Gap Between
            </span>
            <span className="block font-semibold text-[26px] xl mb-8">
              Students{" "}
              <span className="block text-center text-[26px]">and</span>
            </span>

            <img src={echo} />
            <span className="block mt-8 font-bold text-2xl mb-4.5">
              Management
            </span>
          </div>

          <div className="flex flex-col md:mr-[15px] mx-2.5 md:mx-0 items-center md:mt-5 justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl ">
              Echo: Your Voice at CU
            </span>
            <p className="block font-normal mt-[15px] mb-[15px] text-1xl text-center text-[#838383]">
              Create waves, rally support, track change
            </p>
            <button className="flex cursor-pointer w-full my-4 h-16 items-center justify-center gap-1 rounded-xl bg-[#F49B31]  py-1 md:py-2.5 ">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white overflow-hidden">
                <img src={google} alt="Google logo" />
              </span>
              <p className="text-white">Continue with Google</p>
            </button>
            <form
              onSubmit={(e) => handleSubmitLogin(e)}
              className="flex w-full flex-col justify-center items-center mb-8"
            >

              <div className="w-full">
                  <InputGroup
                    type="email"
                    iconSrc={email}
                    placeholder="Enter email..."
                  />
                  <InputGroup
                    type="password"
                    iconSrc={password}
                    placeholder="Enter password..."
                  />
                </div>

              <button
                type="submit"
                className=" w-full py-[30px] whitespace-nowrap flex items-center justify-center   text-white h-8 cursor-pointer bg-[#F49B31] rounded-[9px]"
              >
                Log in
              </button>
            </form>
            <p className="text-[#838383] text-center text-[14px]">
              By Logging into an account, you agree to Echo
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>
            </span>
            <div className=" mb-2.5 md:mb-5 pt-5 border-t border-[#D3CECE] mt-5 self-end w-full">
              <p className="text-center text-[#838383] ">
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
