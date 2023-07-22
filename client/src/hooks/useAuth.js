import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
    const token = useSelector(selectCurrentToken);

    if (token) {
        const decoded = jwtDecode(token)
        const { id, username, isAdmin } = decoded
        return { id, username, isAdmin: isAdmin ? isAdmin : false }
    }

    return { id: null, username: null, isAdmin: null}
}
export default useAuth