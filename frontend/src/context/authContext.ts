import React from "react";

import type { User } from "@/interfaces";

interface AuthContextProps {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = React.createContext<AuthContextProps | null>(null);
