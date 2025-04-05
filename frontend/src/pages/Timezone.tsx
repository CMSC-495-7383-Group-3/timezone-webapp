import { useParams } from "react-router-dom"

export default function Timezone() {
  const { zone } = useParams<{ zone: string }>()

  return (
    <main id="timezone">
      <h1>Timezone</h1>
      <h2>{zone}</h2>
    </main>
  )
}
