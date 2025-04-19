import "./localTimeDisplay.scss"
import { useEffect, useState } from "react"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"

interface ILocalTimeDisplayProps {
  // Shows a seconds counter with the time
  seconds?: boolean
}

// Displays the local time
export default function LocalTimeDisplay(props: ILocalTimeDisplayProps) {
  const [date, setDate] = useState(new Date())
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
        <p className="sun-set-rise">
          <img src={sunriseIcon} alt="sun rise icon" />
          00:00 / <img src={sunsetIcon} alt="sun set icon" />
          00:00
        </p>
      </div>
    </div>
  )
}
