// Database types
export type User = {
  id: string
  name: string
  email: string
  password: never
}

export type TimezoneProfile = {
  id: string
  label: string
  city: string
  timeZone: string // Potentially limit to a list of knows timezones
  sunriseTime: string // Potentially switch to a number for other dateTime
  sunsetTime: string // Potentially switch to a number for other dateTime
  isFavorite: boolean
  valid: boolean
}

export type Contact = {
  id: string
  name: string
  timeZone: string
  notes: string
}

// Frontend types
export type ContactAvailability =
  | "available"
  | "maybe-available"
  | "not-available"

export type formMessage = {
  show: boolean
  success: boolean
  message: string
}
