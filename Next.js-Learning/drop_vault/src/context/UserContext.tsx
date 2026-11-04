
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export type UserType = {
    name: string;
    email: string;
    id: string;
    image?: string | null;
};

type UserContextType = {
    user: UserType | null;
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
    loading: boolean;
};

const UserDataContext = React.createContext<UserContextType | undefined>(
    undefined
);

const UserContext = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getUser() {
            try {
                const result = await axios.get<UserType>("/api/user");
                setUser(result.data);
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        getUser();
    }, []);

    return (
        <UserDataContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserDataContext.Provider>
    );
};

export default UserContext;

export const useUser = () => {
    const context = React.useContext(UserDataContext);

    if (!context) {
        throw new Error("useUser must be used within UserContext");
    }

    return context;
};
