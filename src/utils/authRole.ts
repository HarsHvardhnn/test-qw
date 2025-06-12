import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {clearUserSessionData} from "../utils/logout"
interface DecodedToken {
  role: string;
  exp: number;
  id: string;
  fullName?: string;
  email?: string;
}

const useRequireRole = (requiredRole: string): DecodedToken | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Get query param ?rd=
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("rd");
    console.log('redirect path',redirectPath)

    const redirectToLogin = () => {
        navigate(`/login?rd=${encodeURIComponent(redirectPath || "")}`);
    
    };

    if (!token) {
      localStorage.setItem("saved-path", location.pathname + location.search);
      redirectToLogin();
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);

      // Token expired
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token expired");
clearUserSessionData()
        redirectToLogin();
        return;
      }

      // Role mismatch
      if (decoded.role !== requiredRole) {
        console.log("Role mismatch", decoded.role, requiredRole);
        clearUserSessionData()
        redirectToLogin();
        return;
      }

      setDecodedToken(decoded);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
      redirectToLogin();
    }
  }, [navigate, requiredRole, location.search]);

  return decodedToken;
};

export default useRequireRole;
