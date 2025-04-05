import { useMemo, useState } from "react"
import allTimezones from "../lib/api/allTimezones"
import TimezoneSearchResult from "./TimezoneSearchResult"

const SEARCH_RESULT_LIMIT = 10

//A search form for timezones
export default function TimezoneSearch() {
  // Load all available timezones
  const availableTimezones = useMemo<string[]>(() => {
    return allTimezones()
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
