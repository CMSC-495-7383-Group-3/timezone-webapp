import "./timeZoneDisplay.scss"
import { ReactNode, useEffect, useState } from "react"
import validateTimezone from "../lib/validateTimezone"
import starIcon from "/star_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import ContactList from "./ContactList"
import { Contact, TimezoneProfile } from "../types"
import setFavorite from "../lib/api/setFavorite"
import { Link } from "react-router-dom"

interface ITimezoneDisplayProps {
  // Timezones to be displayed for this component
  timezone: TimezoneProfile
  // List of contacts associated with this timezone
  contacts: Contact[]

  hideContactsList?: boolean

  children?: ReactNode
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
    // TODO this function is slow to respond for some reason. Fix this is possible if this is still a problem when the proper API is implemented
    const result = setFavorite(
      props.timezone.timeZone,
      !props.timezone.isFavorite
    )

    if (result === undefined) alert("Could not change favorite state!") //TODO make some error response

    props.timezone.isFavorite = result!
  }

  if (!props.timezone.valid || !validateTimezone(props.timezone.timeZone)) {
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
          {/* TODO This link is still clickable when on the route that it points to. Potentially fix this. */}
          <Link
            to={`/timezone/${props.timezone.timeZone.replace("/", "-")}`}
            className="invisible-link"
          >
            {props.timezone.label}
          </Link>
        </h3>
        <button
          className={`${
            props.timezone.isFavorite ? "accent" : "secondary"
          } icon`}
          onClick={onFavoriteButtonClick}
        >
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
              timeZone: props.timezone.timeZone,
            })}
          </p>
          <p className="sun-set-rise">
            <img src={sunriseIcon} alt="sun rise icon" />
            00:00 / <img src={sunsetIcon} alt="sun set icon" />
            00:00
          </p>
        </div>
        {!props.hideContactsList ? (
          <ContactList
            contacts={props.contacts}
            time={
              new Date(
                date.toLocaleString("en-US", {
                  timeZone: props.timezone.timeZone,
                })
              )
            }
          />
        ) : (
          <></>
        )}
        {props.children}
      </div>
    </div>
  )
}
