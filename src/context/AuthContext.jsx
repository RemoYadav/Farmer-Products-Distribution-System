import {createContext, useContext} from "react";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate()
    const logOut = () => {
        if (!window.confirm("Are you sure you want to Logout?"))
            return;
        
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        localStorage.removeItem("profileImage")
        localStorage.removeItem("userName")
        localStorage.removeItem("farmName")
        localStorage.removeItem("role")
        navigate("/login",{replace: true});
    }
    return(
        <AuthContext.Provider value={{logOut}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)