import { useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const useExitSession = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const exitSession = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return exitSession;
};

export default useExitSession;
