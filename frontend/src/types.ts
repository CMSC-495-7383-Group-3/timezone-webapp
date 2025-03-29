export type User = {
  id: string
  name: string
  email: string
  password: never
}

export type TomeZoneProfile = {
  id: string
  label: string
  city: string
  timeZone: string // Potentially limit to a list of knows timezones
  sunriseTime: string // Potentially switch to a number for other dateTime
  sunsetTime: string // Potentially switch to a number for other dateTime
  isFavorite: boolean
}

export type Contact = {
  id: string
  name: string
  timeZone: string
  notes: string
}
