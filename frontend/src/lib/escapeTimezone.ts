// Escapes a timezone string so that it can be put into a URL
export default function escapeTimezone(timezone: string): string {
  return timezone.replace("/", "-")
}
