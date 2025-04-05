import "./localTimeDisplay.scss"
import { useEffect, useState } from "react"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"

interface ILocalTimeDisplayProps {
  hideSearch?: boolean
}

// Displays the local time and a search field to search for other timezones
export default function LocalTimeDisplay(props: ILocalTimeDisplayProps) {
  const [date, setDate] = useState(new Date())
  const [query, setQuery] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitted form ", e)
  }

  return (
    <div className="container secondary current-time-display">
      <div className="title">
        <h3>Current Time:</h3>
      </div>
      <div className="primary">
        <div className="time">
          <p className="clock">
            {date.toLocaleString("en-US", {
              hour: "numeric",
              // TODO Determine if we will use 12/24 hour format. Potentially make it a user setting?
              hour12: false,
              minute: "numeric",
            })}
          </p>
          <p className="sun-set-rise">
            <img src={sunriseIcon} alt="sun rise icon" />
            00:00 / <img src={sunsetIcon} alt="sun set icon" />
            00:00
          </p>
        </div>
        {!props.hideSearch ? (
          <div className="container primary search">
            <form onSubmit={onSearchSubmit}>
              <label htmlFor="query">Search Timezones</label>
              <input
                type="text"
                name="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Timezones"
              />
              <input type="submit" value="Search" />
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
