// Database types
export type User = {
  id: number
  email: string
  username: string
  firstName: string
  lastName: string
  registrationDate: Date
  timezone: string
}

export type TimezoneProfile = {
  id: string
  label: string
  city: string
  timezone: string // Potentially limit to a list of knows timezones
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

export type FormMessage = {
  show: boolean
  success: boolean
  message: string
}

export type RegisterFormData = {
  email: string
  username: string
  password: string
  first_name: string
  last_name: string
  timezone: string
}

export type LoginFormData = {
  email: string
  password: string
}
