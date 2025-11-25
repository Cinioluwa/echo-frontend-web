import google from "../assets/images/Google (2).svg";
import password from "../assets/images/Password.svg";
import email from "../assets/images/Email.svg";
import backgroundImage from "../assets/images/backgroundImage.jpg";
import logo from "../assets/images/Echo Logo.svg";
import echo from "../assets/images/Echo.svg";
import InputGroup from "../components/InputGroup";
import { Link } from "react-router-dom";

const SignUp = () => {
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="h-screen bg-cover  bg-no-repeat bg-center gap-[50px] flex flex-col  md:block overflow-x-hidden"
    >
      <header>
        <img
          className=" mx-auto md:mb-12 mt-[43px] md:mt-[30px] md:ml-16 contrast-200"
          src={logo}
        />
      </header>
      {/* SignUp page */}
      <main className="   flex   items-center justify-center">
        {/* SignUp container */}
        <div className="p-[38px] md:flex  bg-white md:p-4 gap-8 rounded-4xl">
          <div className="bg-[#FFC37B] hidden  rounded-2xl md:flex flex-col justify-center items-center p-16 lg:p-32">
            <span className="block whitespace-nowrap font-bold text-2xl mb-4.5">
              Bridge Gap Between
            </span>
            <span className="block font-bold text-2 xl mb-8">
              Students <span className="block text-center">and</span>
            </span>

            <img src={echo} />
            <span className="block mt-8 font-bold text-2xl mb-4.5">
              Management
            </span>
          </div>

          <div className="flex flex-col md:mr-[15px] mx-2.5 md:mx-0 items-center mt-[70px] justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl ">
              Echo: Your Voice at CU
            </span>
            <p className="block font-normal mt-[15px] mb-[15px] text-1xl text-center text-[#838383]">
              Create waves, rally support, track change
            </p>
            <button className="flex cursor-pointer my-4 h-16 items-center justify-center gap-1 rounded-xl bg-[#F49B31]  px-[70px] py-1 md:px-18 md:py-2.5 ">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white overflow-hidden">
                <img src={google} alt="Google logo" />
              </span>
              <p className="text-white">Continue with Google</p>
            </button>
            <form className="flex flex-col justify-center items-center mb-8">
              <p className="hidden   justify-center gap-3 mt-4 mb-20 text-[#838383]">
                <span className="w-7 pr-2 py-1  inline-flex items-center justify-center border-r border-r-[#CACACA]">
                  <img src={email} />
                </span>
                Sign up with Email
              </p>
              <div className=" hidden md:block">
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
                className="hidden md:flex items-center justify-center md:px-[107px] py-[15px] whitespace-nowrap  text-white  h-8 cursor-pointer bg-[#F49B31] rounded-[9px]"
              >
                <Link to={"/waveHistory"}>Sign up</Link>
              </button>

              {/* Mobile sign up CTA */}
              <div className="flex items-center text-[#ACAAAA] justify-center gap-[5px] md:hidden">
                <img src={email} />
                Sign up with email
              </div>
            </form>
            <p className="text-[#838383] mt-[60px] md:mt-0 text-center text-[14px]">
              By creating an account, you agree to Echo
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>
            </span>
            <div className=" mb-5 md:mb-5 pt-[30px] border-t border-[#D3CECE] mt-10 self-end w-full">
              <p className="text-center mb-[85px] mt-[29px] md:mb-0 text-[#838383] ">
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

export default SignUp;
