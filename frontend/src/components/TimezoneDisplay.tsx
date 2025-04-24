import "./timeZoneDisplay.scss"
import { ReactNode, useEffect, useState } from "react"
import validateTimezone from "../lib/validateTimezone"
import starIcon from "/star_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import ContactList from "./ContactList"
import {
  Contact,
  ContactEditorUpdateCallbackFunction,
  TimezoneProfile,
} from "../types"
import { Link } from "react-router-dom"
import escapeTimezone from "../lib/escapeTimezone"

interface ITimezoneDisplayProps {
  // Timezones to be displayed for this component
  timezone: TimezoneProfile
  // List of contacts associated with this timezone
  contacts: Contact[]
  // Explicitly hides the contacts list
  hideContactsList?: boolean
  // Callback for when the timezone updates its favorite status
  favoriteUpdateCallback: (timezone: string, newState: boolean) => void
  // Callback for if this contact is edited
  contactUpdateCallback?: ContactEditorUpdateCallbackFunction
  // Optionally shown along the time
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

  if (!props.timezone.valid || !validateTimezone(props.timezone.timezone)) {
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
            to={`/timezone/${escapeTimezone(props.timezone.timezone)}`}
            className="invisible-link"
          >
            {props.timezone.label}
          </Link>
        </h3>
        <button
          className={`${
            props.timezone.isFavorite ? "accent" : "secondary"
          } icon`}
          onClick={() => {
            props.favoriteUpdateCallback(
              props.timezone.timezone,
              !props.timezone.isFavorite
            )
          }}
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
              timeZone: props.timezone.timezone,
            })}
          </p>
          <p className="sun-set-rise">
            <img src={sunriseIcon} alt="sun rise icon" />
            {props.timezone.sunriseTime} /{" "}
            <img src={sunsetIcon} alt="sun set icon" />
            {props.timezone.sunsetTime}
          </p>
        </div>
        {!props.hideContactsList ? (
          <ContactList
            contacts={props.contacts}
            time={
              new Date(
                date.toLocaleString("en-US", {
                  timeZone: props.timezone.timezone,
                })
              )
            }
            updateCallback={
              props.contactUpdateCallback
                ? props.contactUpdateCallback
                : () => {}
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
