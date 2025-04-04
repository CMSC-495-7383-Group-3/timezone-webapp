export default function escapeTimezone(timezone: string): string {
  return timezone.replace("/", "-")
}
