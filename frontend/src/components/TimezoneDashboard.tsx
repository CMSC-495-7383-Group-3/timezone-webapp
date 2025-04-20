import React, { useState } from "react"
import { Contact, TimezoneProfile } from "../types"
import "./timezoneDashboard.scss"
import TimezoneDisplay from "./TimezoneDisplay"

export default function TimezoneDashboard() {
  const [timezoneData] = useState<
    {
      category: string
      timezones: TimezoneProfile[]
    }[]
  >([
    {
      category: "North America",
      timezones: [
        {
          id: "ny",
          label: "Eastern Time",
          city: "New York",
          timezone: "America/New_York",
          sunriseTime: "06:00",
          sunsetTime: "18:00",
          isFavorite: false,
          valid: true, // Key to pass validation
          contacts: [
            {
              id: "1",
              name: "Alice",
              timezone: "America/New_York",
              phoneNumber: "",
            } as Contact,
          ],
        },
      ],
    },
    {
      category: "Europe",
      timezones: [
        {
          id: "lon",
          label: "Greenwich Mean Time",
          city: "London",
          timezone: "Europe/London",
          sunriseTime: "07:00",
          sunsetTime: "17:00",
          isFavorite: false,
          valid: true, // Key to pass validation
          contacts: [
            {
              id: "2",
              name: "Bob",
              timezone: "Europe/London",
              phoneNumber: "",
            } as Contact,
          ],
        },
      ],
    },
  ])

  return (
    <div className="timezone-dashboard">
      <h2>Timezone Dashboard</h2>
      {timezoneData.map((group, groupIndex) => (
        <div key={groupIndex} className="timezone-category">
          <h3>{group.category}</h3>
          <div className="timezone-container">
            {group.timezones.map((tz, tzIndex) => (
              <TimezoneDisplay
                key={tzIndex}
                timezone={tz} // Pass full TimezoneProfile object
                contacts={tz.contacts}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
