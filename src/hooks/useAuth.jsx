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
    const { id, username, slug, email, profile, roles } = decoded.UserInfo;

    let firstName = username.split(" ");
    firstName = firstName[0];

    isPublisher = roles.includes("Publisher");
    isAdmin = roles.includes("Admin");

    if (isAdmin) {
      status = "Admin";
    } else if (isPublisher) {
      status = "Publisher";
    } else {
      status = "User";
    }

    return { id, firstName, username, slug, email, profile, roles, status, isPublisher, isAdmin };
  }

  return {
    id: null,
    firstName: "",
    username: "",
    slug: "",
    email: "",
    profile: null,
    roles: [],
    isPublisher,
    isAdmin,
    status,
  };
};
export default useAuth;
