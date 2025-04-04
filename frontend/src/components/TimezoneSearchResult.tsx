import { Link } from "react-router-dom"
import escapeTimezone from "../lib/escapeTimezone"

interface ITimeZoneSearchProps {
  timezone: string
}

export default function TimezoneSearchResult(props: ITimeZoneSearchProps) {
  // TODO add a quick favorite button
  return (
    <li>
      <Link to={`/timezone/${escapeTimezone(props.timezone)}`}>
        {props.timezone}
      </Link>
    </li>
  )
}
