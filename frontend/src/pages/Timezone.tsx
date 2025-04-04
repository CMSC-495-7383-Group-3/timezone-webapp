import { useParams } from "react-router-dom"
import TimezoneDisplay from "../components/TimezoneDisplay"
import contactsByTimezone from "../lib/api/contactsByTimezone"
import { useMemo } from "react"
import { Contact } from "../types"

export default function Timezone() {
  const { zone } = useParams<{ zone: string }>()
  const timezoneIdentifier = zone ? zone.replace("-", "/") : ""
  const contacts = useMemo<Contact[]>(() => {
    return contactsByTimezone(timezoneIdentifier!)
  }, [timezoneIdentifier])

  return (
    <main id="timezone">
      <h1>Timezone</h1>

      <div className="container primary">
        <TimezoneDisplay timezone={timezoneIdentifier} contacts={contacts} />
      </div>
    </main>
  )
}
