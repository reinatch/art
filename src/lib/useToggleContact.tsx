"use client";
import React, { createContext, useContext, useState } from "react";

interface ToggleContactContextType {
    isContactOpen: boolean;
    openContact: () => void;
    closeContact: () => void;
}

const ToggleContactContext = createContext<ToggleContactContextType | undefined>(undefined);

export const ToggleContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isContactOpen, setIsContactOpen] = useState<boolean>(false);

    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    return (
        <ToggleContactContext.Provider value={{ isContactOpen, openContact, closeContact }}>
            {children}
        </ToggleContactContext.Provider>
    );
};

export const useToggleContact = () => {
    const context = useContext(ToggleContactContext);
    if (!context) {
        throw new Error("useToggleContact must be used within a ToggleContactProvider");
    }
    return context;
};
