import React from "react";
import { Link } from "react-router-dom";
import "./nav.scss";

const Nav: React.FC = () => {
  return (
<<<<<<< HEAD
    <nav className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/test">Test</Link></li>
        {/* Other links */}
      </ul>
=======
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/favorites">Favorite Timezones</NavLink>
      <NavLink to="/test">Test Page</NavLink>
>>>>>>> dev
    </nav>
  );
};

export default Nav;