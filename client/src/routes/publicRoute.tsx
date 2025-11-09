import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import LoadingScreen from "../components/LoadingScreen";

export const PublicRoute = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) return <LoadingScreen />

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};
