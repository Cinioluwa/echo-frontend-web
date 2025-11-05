import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div>
      <AuthForm
        ctaText="Log in"
        disclaimer="By Logging into an account, you agree to Echo"
      >
        <div className=" mb-20 md:mb-5 pt-[30px] border-t border-[#D3CECE] mt-10 self-end w-full">
          <p className="text-center text-[#838383] ">
            Don't have an account?
            <a
              href="#"
              className="text-[#F49B31] whitespace-nowrap cursor-pointer"
            >
              sign up
            </a>
          </p>
        </div>
      </AuthForm>
    </div>
  );
};

export default Login;
