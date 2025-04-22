import "./timeZoneDisplay.scss"
import { ReactNode, useEffect, useState } from "react"
import validateTimezone from "../lib/validateTimezone"
import starIcon from "/star_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunriseIcon from "/sunny_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import sunsetIcon from "/bedtime_24dp_0B0911_FILL0_wght400_GRAD0_opsz24.svg"
import ContactList from "./ContactList"
import { Contact, TimezoneProfile, TimezoneTimingData } from "../types"
import setFavorite from "../lib/api/setFavorite"
import { Link } from "react-router-dom"
import escapeTimezone from "../lib/escapeTimezone"
import getTimezoneNamed from "../lib/api/getTimezoneNamed"

const FALLBACK_TIME: TimezoneTimingData = {
  timezone_id: "",
  dst_offset: "",
  raw_offset: "",
  sunrise: "00:00",
  sunset: "00:00",
}

interface ITimezoneDisplayProps {
  // Timezones to be displayed for this component
  timezone: TimezoneProfile
  // List of contacts associated with this timezone
  contacts: Contact[]
  // Explicitly hides the contacts list
  hideContactsList?: boolean
  // Optionally shown along the time
  children?: ReactNode
}

//Component for displaying a single timezone with a list of associated contacts
export default function TimezoneDisplay(props: ITimezoneDisplayProps) {
  const [date, setDate] = useState(new Date())
  const [timezoneTiming, setTimezoneTiming] =
    useState<TimezoneTimingData>(FALLBACK_TIME)

  useEffect(() => {
    const getTimezoneTiming = async () => {
      setTimezoneTiming(await getTimezoneNamed(props.timezone.timezone))
    }

    getTimezoneTiming()
  }, [props.timezone])

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date())
    }, 1000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  const onFavoriteButtonClick = async () => {
    const result = await setFavorite(
      props.timezone.timezone,
      !props.timezone.isFavorite
    )

    if (result === undefined) alert("Could not change favorite state!") //TODO make some error response

    props.timezone.isFavorite = result!
  }

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
              timeZone: props.timezone.timezone,
            })}
          </p>
          <p className="sun-set-rise">
            <img src={sunriseIcon} alt="sun rise icon" />
            {timezoneTiming.sunrise} /{" "}
            <img src={sunsetIcon} alt="sun set icon" />
            {timezoneTiming.sunset}
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
          />
        ) : (
          <></>
        )}
        {props.children}
      </div>
    </div>
  )
}
