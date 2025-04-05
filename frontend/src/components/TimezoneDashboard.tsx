import React, { useState } from "react";
import { Contact } from "../types";
import "./timezoneDashboard.scss";
import TimezoneDisplay from "./TimezoneDisplay";

const TimezoneDashboard: React.FC = () => {
  const [timezoneData] = useState([
    {
      timezone: "America/New_York",
      contacts: [{ id: 1, name: "Alice" } as Contact],
    },
    {
      timezone: "Europe/London",
      contacts: [{ id: 2, name: "Bob" } as Contact],
    },
  ]);

  return (
    <div className="timezone-dashboard">
      <h2>Timezone Dashboard</h2>
      <div className="timezone-container">
        {timezoneData.map((tz, index) => (
          <TimezoneDisplay
            key={index}
            timezone={tz.timezone}
            contacts={tz.contacts}
          />
        ))}
      </div>
    </div>
  );
};

export default TimezoneDashboard;