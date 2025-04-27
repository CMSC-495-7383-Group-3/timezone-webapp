import { User } from "../types"

// Used to convert the user object given from the backend to fit the frontend
// Rename some fields so that they fit the naming convention of the rest of the frontend
export default function convertUserObject(data: any): User {
  return {
    id: data.id,
    email: data.email,
    username: data.username,
    firstName: data.first_name,
    lastName: data.last_name,
    registrationDate: new Date(data.registration_date),
    timezone: data.timezone,
  }
}
