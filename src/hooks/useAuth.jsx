import { useSelector } from "react-redux";
import { selectToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectToken);
  let isPublisher = false;
  let isAdmin = false;
  let status = "";

  if (token) {
    const decoded = jwtDecode(token);
    const { username, email, roles } = decoded.UserInfo;

    let firstName = username.split(" ")
    firstName = firstName[0].toUpperCase()

    isPublisher = roles.includes("Publisher");
    isAdmin = roles.includes("Admin");

    if (isAdmin) {
      status = "Admin";
    } else if (isPublisher) {
      status = "Publisher";
    } else {
      status = "User";
    }

    return { firstName, username, email, roles, status, isPublisher, isAdmin };
  }

  return { username: "", email: "", roles: [], isPublisher, isAdmin, status };
};
export default useAuth;
