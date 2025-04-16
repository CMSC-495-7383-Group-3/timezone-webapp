import React from "react"
import { NavLink } from "react-router-dom"
import "./nav.scss"

const Nav: React.FC = () => {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/favorites">Favorite Timezones</NavLink>
      <NavLink to="/test">Test Page</NavLink>
    </nav>
  )
}

export default Nav
