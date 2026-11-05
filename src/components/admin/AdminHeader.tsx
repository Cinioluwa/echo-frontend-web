const AdminHeader = ({ title }: { title: string }) => {
    return (
        <h1 className="w-full text-[var(--echo-text-primary)] font-semibold text-[24px] sm:text-[28px] leading-[26px] sm:leading-[30.8px] tracking-[-0.5px] min-[1131px]:hidden">
            {title}
        </h1>
    );
};

export default AdminHeader;