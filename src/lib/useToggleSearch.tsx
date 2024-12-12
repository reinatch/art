"use client";
import React, { createContext, useContext, useState } from "react";

interface ToggleSearchContextType {
    isSearchOpen: boolean;
    openSearch: () => void;
    closeSearch: () => void;
}

const ToggleSearchContext = createContext<ToggleSearchContextType | undefined>(undefined);

export const ToggleSearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

    const openSearch = () => setIsSearchOpen(true);
    const closeSearch = () => setIsSearchOpen(false);

    return (
        <ToggleSearchContext.Provider value={{ isSearchOpen, openSearch, closeSearch }}>
            {children}
        </ToggleSearchContext.Provider>
    );
};

export const useToggleSearch = () => {
    const context = useContext(ToggleSearchContext);
    if (!context) {
        throw new Error("useToggleSearch must be used within a ToggleSearchProvider");
    }
    return context;
};
