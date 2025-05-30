import "./localTimeDisplay.scss"
import { useEffect, useState } from "react"

interface ILocalTimeDisplayProps {
  // Shows a seconds counter with the time
  seconds?: boolean
}

// Displays the local time
export default function LocalTimeDisplay(props: ILocalTimeDisplayProps) {
  const [date, setDate] = useState(new Date())

  // Creates an interval that updates the date object to the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="container accent current-time-display">
      <div className="title">
        <h3>Current Time:</h3>
      </div>
      <div className="time">
        <p className="clock">
          {date.toLocaleString("en-US", {
            hour: "numeric",
            // TODO Determine if we will use 12/24 hour format. Potentially make it a user setting?
            hour12: false,
            minute: "numeric",
            second: props.seconds ? "numeric" : undefined,
          })}
        </p>
        {/* <p className="sun-set-rise">
          <img src={sunriseIcon} alt="sun rise icon" />
          00:00 / <img src={sunsetIcon} alt="sun set icon" />
          00:00
        </p> */}
      </div>
    </div>
  )
}
