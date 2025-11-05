import AuthForm from "../components/AuthForm";

const Login = () => {
  return (
    <div>
      <AuthForm
        ctaText="Sign Up"
        disclaimer="By creating an account, you agree to Echo"
      >
        <div className=" mb-20 md:mb-5 pt-[30px] border-t border-[#D3CECE] mt-10 self-end w-full">
          <p className="text-center text-[#838383] ">
            Already have an account?
            <a
              href="#"
              className="text-[#F49B31] whitespace-nowrap cursor-pointer"
            >
              Log in
            </a>
          </p>
        </div>
      </AuthForm>
    </div>
  );
};

export default Login;
