import { createContext, useContext, type ReactNode } from "react";

interface PingCreatorContextType {
    expandPingCreator: () => void;
}

const PingCreatorContext = createContext<PingCreatorContextType | undefined>(undefined);

interface PingCreatorProviderProps {
    children: ReactNode;
    expandPingCreator: () => void;
}

export const PingCreatorProvider = ({ children, expandPingCreator }: PingCreatorProviderProps) => {
    return (
        <PingCreatorContext.Provider value={{ expandPingCreator }}>
            {children}
        </PingCreatorContext.Provider>
    );
};

export const usePingCreator = (): PingCreatorContextType => {
    const context = useContext(PingCreatorContext);
    if (!context) {
        throw new Error("usePingCreator must be used within PingCreatorProvider");
    }
    return context;
};
