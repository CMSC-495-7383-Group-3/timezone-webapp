import "./nav.scss"
import { NavLink } from "react-router-dom"

export default function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/favorites">Favorite Timezones</NavLink>
      <NavLink to="/test">Test Page</NavLink>
    </nav>
  )
}
