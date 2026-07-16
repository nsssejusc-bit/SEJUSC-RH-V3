import React from "react";

import { AuthContext } from "./authContext";

export default function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro de um AuthProvider");
  return context;
}
