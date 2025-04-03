import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import contactsByTimezone from "../lib/api/contactsByTimezone"

export default function Timezone() {
  const { zone } = useParams<{ zone: string }>()

  if (!zone)
    return (
      <main id="timezone">
        <h1 className="color-red">Invalid Route Parameters.</h1>
      </main>
    )

  const timezoneIdentifier = zone?.replace("-", "/")

  return (
    <main id="timezone">
      <h1>Timezone</h1>

      <div className="container primary">
        <TimezoneDisplay
          timezone={timezoneIdentifier}
          contacts={contactsByTimezone(timezoneIdentifier)}
        />
      </div>
    </main>
  )
}
