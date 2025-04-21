import { NavLink } from "react-router-dom"
import "./nav.scss"
import { useState } from "react"

export default function Nav() {
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
      </nav>
    </div>
  )
}
