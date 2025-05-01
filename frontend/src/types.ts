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
  timezone: string
  phoneNumber: string
}

export type TimezoneTimingData = {
  timezone_id: string
  dst_offset: string
  raw_offset: string
  sunrise: string
  sunset: string
}

export type Favorite = {
  id: string
  user: string
  timezone: string
  addedDate: Date
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

export type ContactsMapping = {
  [key: string]: Contact[]
}

export enum ContactEditorUpdateAction {
  ADD,
  UPDATE,
  DELETE,
}

export type ContactEditorUpdateCallbackFunction = (
  data: Contact,
  action: ContactEditorUpdateAction
) => void
