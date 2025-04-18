import { NavLink } from "react-router-dom"
import "./nav.scss"
import { useContext, useState } from "react"
import { AuthContext } from "../context/authContext"

export default function Nav() {
  const authContext = useContext(AuthContext)

  // For mobile, the nav should expand or shrink
  const [expanded, setExpanded] = useState(false)

  return (
    <div id="nav" className={expanded ? "expanded" : ""}>
      <button id="toggle-nav" onClick={() => setExpanded(!expanded)}>
        {expanded ? "⮝" : "⮟"}
      </button>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/favorites">Favorite Timezones</NavLink>
        <NavLink to="/test">Test Page</NavLink>
        <div className="spacer" />
        {authContext.isAuthenticated ? (
          <>
            <p>Logged in as: </p>
            <NavLink to="/userSettings">{authContext.user.username}</NavLink>
            <NavLink to="/logout">Logout</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </div>
  )
}
