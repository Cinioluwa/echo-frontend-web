import logo from "../assets/images/Echo Logo_black.svg";
import SearchInput from "./SearchInput";
import UserInfo from "./UserInfo";

const NavBar = () => {
  return (
    <div className="bg-[#FFC37B] flex items-center justify-between">
      <img src={logo} className=" brightness-0 contrast-200" />
      <SearchInput />
      <UserInfo />
    </div>
  );
};

export default NavBar;
