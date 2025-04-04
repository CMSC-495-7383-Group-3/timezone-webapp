import { useMemo, useState } from "react"
import allTimezoneLabels from "../lib/api/allTimezoneLabels"
import TimezoneSearchResult from "./timezoneSearchResult"

const SEARCH_RESULT_LIMIT = 10

export default function TimeZoneSearch() {
  const availableTimezones = useMemo<string[]>(() => {
    return allTimezoneLabels()
  }, [])
  const [query, setQuery] = useState("")

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Submitted form ", e)
  }

  return (
    <div className="container primary search">
      <form onSubmit={onSearchSubmit}>
        <label htmlFor="query">Search Timezones</label>
        <input
          type="text"
          name="query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Timezones"
        />
        <ul className="results">
          {query.length > 0 ? (
            availableTimezones
              .filter((tz) => tz.toLowerCase().includes(query.toLowerCase()))
              .filter((_, i) => i < SEARCH_RESULT_LIMIT)
              .map((tz, i) => (
                <TimezoneSearchResult
                  timezone={tz}
                  key={`timezone-search-result-${tz}-${i}`}
                />
              ))
          ) : (
            <></>
          )}
        </ul>
        <input type="submit" value="Search" />
      </form>
    </div>
  )
}
