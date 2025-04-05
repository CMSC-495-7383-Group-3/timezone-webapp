import React from "react";
import { Link } from "react-router-dom";
import "./nav.scss";

const Nav: React.FC = () => {
  return (
    <nav className="nav">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/test">Test</Link></li>
        {/* Other links */}
      </ul>
    </nav>
  );
};

export default Nav;