import React, { createContext, useContext, useState, type ReactNode } from "react";

export type AdminPage = "soundboard" | "followUp" | "moderation" | "settings" | "institution" | "profile";

interface AdminPageContextType {
    currentPage: AdminPage;
    setCurrentPage: (page: AdminPage) => void;
    pages: {
        soundboard: boolean;
        followUp: boolean;
        moderation: boolean;
        settings: boolean;
        institution: boolean;
        profile: boolean;
    };
}

const AdminPageContext = createContext<AdminPageContextType | undefined>(undefined);

export const AdminPageProvider: React.FC<{ children: ReactNode; initialPage?: AdminPage }> = ({
    children,
    initialPage = "soundboard",
}) => {
    const [currentPage, setCurrentPageState] = useState<AdminPage>(initialPage);

    const setCurrentPage = (page: AdminPage) => {
        setCurrentPageState(page);
    };

    const pages = {
        soundboard: currentPage === "soundboard",
        followUp: currentPage === "followUp",
        moderation: currentPage === "moderation",
        settings: currentPage === "settings",
        institution: currentPage === "institution",
        profile: currentPage === "profile",
    };

    return (
        <AdminPageContext.Provider value={{ currentPage, setCurrentPage, pages }}>
            {children}
        </AdminPageContext.Provider>
    );
};

// Context files intentionally co-locate the provider and its consumer hook —
// a standard React pattern that this fast-refresh rule does not account for.
// eslint-disable-next-line react-refresh/only-export-components
export const useAdminPage = (): AdminPageContextType => {
    const context = useContext(AdminPageContext);
    if (context === undefined) {
        throw new Error("useAdminPage must be used within AdminPageProvider");
    }
    return context;
};
