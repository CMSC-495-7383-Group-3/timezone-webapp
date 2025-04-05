import React, { useState } from "react";
import { Contact, TimezoneProfile } from "../types";
import "./timezoneDashboard.scss";
import TimezoneDisplay from "./TimezoneDisplay";

const TimezoneDashboard: React.FC = () => {
  const [timezoneData] = useState<TimezoneProfile[]>([
    {
      id: "ny",
      label: "Eastern Time",
      city: "New York",
      timezone: "America/New_York",
      sunriseTime: "06:00",
      sunsetTime: "18:00",
      isFavorite: false,
      valid: true, // Key to pass validation
      contacts: [{ id: "1", name: "Alice", timeZone: "America/New_York", notes: "" } as Contact],
    },
    {
      id: "lon",
      label: "Greenwich Mean Time",
      city: "London",
      timezone: "Europe/London",
      sunriseTime: "07:00",
      sunsetTime: "17:00",
      isFavorite: false,
      valid: true, // Key to pass validation
      contacts: [{ id: "2", name: "Bob", timeZone: "Europe/London", notes: "" } as Contact],
    },
  ]);

  return (
    <div className="timezone-dashboard">
      <h2>Timezone Dashboard</h2>
      <div className="timezone-container">
        {timezoneData.map((tz, index) => (
          <TimezoneDisplay
            key={index}
            timezone={tz} // Pass full TimezoneProfile object
            contacts={tz.contacts}
          />
        ))}
      </div>
    </div>
  );
};

export default TimezoneDashboard;