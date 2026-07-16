import { Navigate } from "react-router";

import useAuth from "@/context/useAuth";

export default function ProtectedRoute({ children }: React.PropsWithChildren) {
  const { user } = useAuth();

  if (user === null) {
    return <Navigate to="/" replace />;
  }

  return children;
}
