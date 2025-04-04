import { useState } from "react"

export default function TimeZoneSearch() {
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
        <input type="submit" value="Search" />
      </form>
    </div>
  )
}
