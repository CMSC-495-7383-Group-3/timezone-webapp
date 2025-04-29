import capitalize from "capitalize"

// Converts errors given by the backend to fit the frontend
export default function convertErrors(data: any): string[] {
  let errors: string[] = []

  for (const [key, value] of Object.entries(data)) {
    errors.push(capitalize(key) + ":")
    errors.push((value as any).join("\n"))
  }

  return errors
}
