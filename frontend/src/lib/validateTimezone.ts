// Determines if a timezone is valid or not
export default function validateTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch (_e) {
    return false
  }
}
