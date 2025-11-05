import logo from "../assets/images/Echo Logo_black.svg";
import echoBrand from "../assets/images/Echo brand.svg";
import SearchInput from "./SearchInput";
import UserInfo from "./UserInfo";

const NavBar = () => {
  return (
    <div className="bg-[#FFC37B] flex items-center justify-between">
      <div className=" hidden md:block">
        <img src={logo} className=" brightness-0 contrast-200" />
      </div>
      <div className="block md:hidden min-w-[20%]">
        <img src={echoBrand} className=" brightness-0 contrast-200" />
      </div>
      <SearchInput />
      <UserInfo />
    </div>
  );
};

export default NavBar;
