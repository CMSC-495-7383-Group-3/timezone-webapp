import { Link } from "react-router-dom"
import LocalTimeDisplay from "../components/LocalTimeDisplay"
import TimezoneSearch from "../components/TimezoneSearch"
import "./home.scss"

export default function Home() {
  return (
    <main id="home">
      <div className="header">
        <h1>Home</h1>
        <h2>Timezone Webapp</h2>
        <p>CMSC 495 Group 3</p>
      </div>
      <div className="flex fill">
        <LocalTimeDisplay seconds />
        <TimezoneSearch />
      </div>
      <div className="flex">
        <div className="container">
          <h2>About</h2>
          <p>
            The Time Zone Management Web Application is designed to provide
            users with a simple and effective tool for managing multiple time
            zones, tracking sunrise and sunset times, and associating contacts
            with specific time zones. The application aims to improve the way
            users keep track of different time zones efficiently by offering an
            intuitive interface and seamless functionality.
          </p>
        </div>
        <div className="container">
          <h2>Usage</h2>
          <p>
            To use the application, simply{" "}
            <Link to="/register">create an account</Link> and search for a
            timezone that should be tracked.
          </p>
          <p>
            On a timezone page, options are available to add contacts. After
            adding a contact, it is possible to edit it by clicking on it in the
            contact list.
          </p>
        </div>
      </div>
    </main>
  )
}
