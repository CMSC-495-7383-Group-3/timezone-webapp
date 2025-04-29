import api from "../../api"
import { Favorite } from "../../types"
import convertFavorite from "../convertFavorite"

export default async function allFavoriteTimezoneRecords(): Promise<
  Favorite[]
> {
  return api
    .get("/favorites")
    .then((res) => {
      return res.data.map((record: any) => convertFavorite(record))
    })
    .catch((_err) => [])
}
