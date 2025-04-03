import "./timeZoneDisplay.scss"
import { useEffect, useState } from "react"
import { Contact } from "../types"
import ContactListItem from "./ContactListItem"
import validateTimezone from "../lib/validateTimezone"
import determineContactAvailability from "../lib/determineContactAvailability"
import starIcon from "/star_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"

interface ITimezoneDisplayProps {
  // Timezones to be displayed for this component
  timezone: string
  // List of contacts associated with this timezone
  contacts: Contact[]
}

function prettyTimezoneName(timezone: string): string {
  // TODO We will potentially need to turn the timezone's code into a pretty printed name.
  // TODO this is a placeholder function to do this.
  return timezone.replace("_", " ")
}

//Component for displaying a single timezone with a list of associated contacts
export default function TimezoneDisplay(props: ITimezoneDisplayProps) {
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const onFavoriteButtonClick = () => {
    console.log("Favorite Button click placeholder.")
  }

  if (!validateTimezone(props.timezone)) {
    return (
      <div className="container secondary timezone-display">
        <h3 className="color-red">Invalid Timezone</h3>
      </div>
    )
  }

  return (
    <div className="container secondary timezone-display">
      <div className="title">
        <h3>
          <a
            href={`/timezone/${props.timezone.replace("/", "-")}`}
            className="invisible-link"
          >
            {prettyTimezoneName(props.timezone)}
          </a>
        </h3>
        <button className="secondary icon" onClick={onFavoriteButtonClick}>
          <img src={starIcon} alt="star icon" />
        </button>
      </div>
      <div className="primary">
        <div className="time">
          <p className="clock">
            {date.toLocaleString("en-US", {
              hour: "numeric",
              // TODO Determine if we will use 12/24 hour format. Potentially make it a user setting?
              hour12: false,
              minute: "numeric",
              timeZone: props.timezone,
            })}
          </p>
          <p className="sun-set-rise">
            <img src={sunriseIcon} alt="sun rise icon" />
            00:00 / <img src={sunsetIcon} alt="sun set icon" />
            00:00
          </p>
        </div>
        <ul className="contacts-list">
          {props.contacts.map((contact) => (
            <ContactListItem
              contact={contact}
              // TODO: Find a better way to call this, depending on how to final timezone resolution will work
              availability={determineContactAvailability(
                new Date(
                  date.toLocaleString("en-US", {
                    timeZone: props.timezone,
                  })
                )
              )}
              key={`timezone-list-item-${contact.id}`}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
