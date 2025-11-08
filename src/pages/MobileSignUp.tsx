import password from "../assets/images/Password.svg";
import email from "../assets/images/Email.svg";
import backgroundImage from "../assets/images/backgroundImage.jpg";
import logo from "../assets/images/Echo Logo.svg";
import InputGroup from "../components/InputGroup";

const MobileSignUp = () => {
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
      {/* Login page */}
      <main className="   flex   items-center justify-center">
        {/* Login container */}
        <div className="p-[38px] md:flex  bg-white  gap-8 rounded-4xl">
          <div className="flex flex-col  mx-2.5 md:mx-0 items-center mt-[70px] justify-center">
            <span className="block font-semibold max-w-[330px] text-center text-4xl ">
              Echo: Your Voice at CU
            </span>
            <p className="block font-normal mt-[15px] mb-[15px] text-1xl text-center text-[#838383]">
              Create waves, rally support, track change
            </p>

            <form className="flex flex-col justify-center items-center mb-8">
              <p className="hidden   justify-center gap-3 mt-4 mb-20 text-[#838383]">
                <span className="w-7 pr-2 py-1  inline-flex items-center justify-center border-r border-r-[#CACACA]">
                  <img src={email} />
                </span>
                Sign up with Email
              </p>
              <div className="mt-5 mb-[15px]">
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
                className=" flex items-center justify-center px-20 py-[7px] whitespace-nowrap  text-white  h-8 cursor-pointer bg-[#F49B31] rounded-[9px]"
              >
                Sign up
              </button>
              <div className="flex items-center my-[30px] text-[#ACAAAA] justify-center gap-[5px] md:hidden">
                <img src={email} />
                Sign up with email
              </div>
            </form>
            <p className="text-[#838383] text-center text-[14px]">
              By Logging into an account, you agree to Echo
            </p>
            <span className="text-[#F49B31] text-[14px] mt-3">
              <a href="#">Terms of Use</a>, <a href="#">Privacy Policy</a>
            </span>
            <div className=" mb-5 md:mb-5 pt-[30px] border-t border-[#D3CECE] mt-10 self-end w-full">
              <p className="text-center text-[#838383] ">
                Already have an account?
                <a
                  href="#"
                  className="pl-1 text-[#F49B31] whitespace-nowrap cursor-pointer"
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MobileSignUp;
