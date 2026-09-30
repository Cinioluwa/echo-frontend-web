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

// Context files intentionally co-locate the provider and its consumer hook —
// a standard React pattern that this fast-refresh rule does not account for.
// eslint-disable-next-line react-refresh/only-export-components
export const usePingCreator = (): PingCreatorContextType => {
    const context = useContext(PingCreatorContext);
    if (!context) {
        throw new Error("usePingCreator must be used within PingCreatorProvider");
    }
    return context;
};
