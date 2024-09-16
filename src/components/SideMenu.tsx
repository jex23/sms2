import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Make sure this path is correct
import "./SideMenu.css"; // We'll style this later

const SideMenu = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to the login page after logging out
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="sidenav">
      <h2 className="menu-header">SMS Report App</h2>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/page1">Page 1</Link>
        </li>
        <li>
          <Link to="/page2">Page 2</Link>
        </li>
        <li>
          <Link to="/page3">Page 3</Link>
        </li>
        <li>
          <Link to="/page4">Page 4</Link>
        </li>
        <li>
          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
