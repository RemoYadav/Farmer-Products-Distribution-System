import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const Referesh = ({ setIsAuthenticated, setRole, setLoading }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setRole(null);
      } else {
        setIsAuthenticated(true);
        setRole(decoded.role);
      }
    } catch {
      localStorage.removeItem("token");
    } finally {
      setLoading(false); // 🔥 IMPORTANT
    }
  }, []);

  return null;
};

export default Referesh;
