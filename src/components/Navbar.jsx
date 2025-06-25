import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaMoon } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { IoMdSunny } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

import "./Navbar.css";
import { voteActions } from "./store/vote-slice";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isNavShowing, setIsNavShowing] = useState(false);
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("voting-app") || ""
  );
  const token = useSelector((state) => state.vote.currentVoter?.token);

  // const location = useLocation();
  // const dispatch = useDispatch();
  // const navigate = useNavigate();

  // const handleLogout = () => {
  //   dispatch(voteActions.changeCurrentVoter(null));
  //   localStorage.removeItem("currentVoter");
  //   toast.success("You’ve been logged out successfully.");
  //   setIsNavShowing(false);
  //   navigate("/");
  // };

  // Apply theme class to body
  useEffect(() => {
    document.body.className = darkTheme;
  }, [darkTheme]);

  // Handle theme toggle
  const changeTheme = () => {
    const newTheme = darkTheme === "dark" ? "" : "dark";
    localStorage.setItem("voting-app", newTheme);
    setDarkTheme(newTheme);
  };

  // Auto-close nav when route changes
  useEffect(() => {
    setIsNavShowing(false);
  }, [location]);

  // Close mobile menu if user logs out
  useEffect(() => {
    if (!token) {
      setIsNavShowing(false);
    }
  }, [token]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navContainer = document.querySelector(".nav-container");
      if (navContainer && !navContainer.contains(e.target)) {
        setIsNavShowing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav>
      <div className="container nav-container">
        <Link to="/results" className="logo">
          <h3>SAMVIC CODES</h3>
        </Link>

        <div className="nav-container-child">
          {token && (
            <ul
              className={`nav-links ${isNavShowing ? "show-nav" : "hide-nav"}`}
            >
              <li>
                <NavLink to="/elections">Elections</NavLink>
              </li>
              <li>
                <NavLink to="/results">Results</NavLink>
              </li>
              <li>
                <NavLink to="/logout">Logout</NavLink>
              </li>
            </ul>
          )}

          <div className="nav_toggle_container">
            <button
              className="nav_toggle"
              onClick={changeTheme}
              aria-label="Toggle Theme"
            >
              {darkTheme === "dark" ? <IoMdSunny /> : <FaMoon />}
            </button>

            {token && (
              <div className="nav-btn">
                <button
                  className="nav-toggle-btn"
                  onClick={() => setIsNavShowing((prev) => !prev)}
                  aria-label="Toggle Navigation"
                >
                  {isNavShowing ? <IoCloseSharp /> : <FaBars />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
