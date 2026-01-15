import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const Referesh = ({ setIsAuthenticated, setRole, setLoading }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      setRole(null);

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
    } catch (err) {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setRole(null);
    } finally {
       setLoading(false); // minimum 500ms loading
    }
  }, [setIsAuthenticated, setRole, setLoading]);

  return null;
};

export default Referesh;
