import { MenuIcon } from "lucide-react";

const AdminHeader = ({ title, setOpenMenu, openMenu }: { title: string, setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>, openMenu: boolean }) => {
    return (
        <>
            <div className="w-full flex items-center gap-2 md:hidden" onClick={() => setOpenMenu(!openMenu)}>
                <MenuIcon className="w-6 h-6" color="#F49B31" />
                <h1 className="text-[#212121] font-semibold text-[24px] sm:text-[28px] leading-[26px] sm:leading-[30.8px] tracking-[-0.5px]">{title}</h1>
            </div>
        </>
    );
};

export default AdminHeader;