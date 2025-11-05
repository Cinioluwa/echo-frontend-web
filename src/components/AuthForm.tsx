import google from "../assets/images/Google (2).svg";
import password from "../assets/images/Password.svg";
import email from "../assets/images/Email.svg";
import backgroundImage from "../assets/images/backgroundImage.jpg";
import logo from "../assets/images/Echo Logo.svg";
import echo from "../assets/images/Echo.svg";
import InputGroup from "./InputGroup";
import type { ReactNode } from "react";

interface AuthFormProps {
  children: ReactNode;
  ctaText: string;
  disclaimer: string;
}

const AuthForm = ({
  children,
  ctaText,
  disclaimer: footerText,
}: AuthFormProps) => {
  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="h-screen w-full overflow-scroll bg-cover bg-no-repeat bg-center"
    >
      <header>
        <img
          className=" mx-auto mb-12 mt-16 md:ml-16 md:mt-1.5 contrast-200"
          src={logo}
        />
      </header>
      {/* SignUp page */}
      <main className="flex mt-[34px] w-full items-center justify-center">
        {/* SignUp container */}
        <div className="p-12 md:flex  bg-white md:p-4 gap-8 rounded-4xl">
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

          <div className="flex flex-col  items-center mt-[70px] justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl ">
              Echo: Your Voice at CU
            </span>
            <p className="block font-normal mt-[15px] mb-[15px] text-1xl text-center text-[#838383]">
              Create waves, rally support, track change
            </p>
            <button className="flex cursor-pointer my-4 h-16 items-center justify-center gap-1 rounded-xl bg-[#F49B31] px-15 py-1 md:px-18 md:py-2.5 ">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white overflow-hidden">
                <img src={google} alt="Google logo" />
              </span>
              <p className="text-white">Continue with Google</p>
            </button>
            <form className="flex flex-col justify-center items-center mb-8">
              <p className="md:hidden flex justify-center gap-3 mt-4 mb-20 text-[#838383]">
                <span className="w-7 pr-2 py-1  inline-flex items-center justify-center border-r border-r-[#CACACA]">
                  <img src={email} />
                </span>
                Sign up with Email
              </p>
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
              <button
                type="submit"
                className=" hidden md:block px-20 md:px-32 text-white h-8 cursor-pointer bg-[#F49B31] rounded-[9px]"
              >
                {ctaText}
              </button>
            </form>
            <p className="text-[#838383] text-center text-[14px]">
              {footerText}
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>,<a href="#">Privacy Policy</a>
            </span>

            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthForm;
