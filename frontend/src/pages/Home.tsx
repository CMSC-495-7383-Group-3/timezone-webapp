import LocalTimeDisplay from "../components/LocalTimeDisplay"
import TimezoneSearch from "../components/TimezoneSearch"
import "./home.scss"

export default function Home() {
  return (
    <main id="home">
      <div className="header">
        <h1>Home</h1>
        <h2>Timezone Webapp</h2>
        <p>CMSC 495 Group 3</p>
      </div>
      <div className="flex fill">
        <LocalTimeDisplay seconds />
        <TimezoneSearch />
      </div>
      <div className="flex">
        <div className="container">
          <h2>About 1</h2>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
          molestiae, qui dolorem veritatis voluptates animi error tempore nisi
          dolorum incidunt consequatur ipsum sit repellendus tenetur natus
          soluta! Placeat, aspernatur esse!
        </div>
        <div className="container">
          <h2>About 2</h2>
          Reiciendis eveniet suscipit ab ipsa dolore voluptatem delectus
          aspernatur veniam iste mollitia deserunt aut nulla molestias dolores
          explicabo necessitatibus quaerat perferendis quo quidem vero
          recusandae eum, tempore nesciunt nobis. Quo!
        </div>
      </div>
    </main>
  )
}
