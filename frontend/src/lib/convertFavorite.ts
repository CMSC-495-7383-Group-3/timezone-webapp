import { Favorite } from "../types"

export default function (data: any): Favorite {
  return {
    id: data.id,
    user: data.user,
    timezone: data.timezone,
    addedDate: new Date(data.added_date),
  }
}
