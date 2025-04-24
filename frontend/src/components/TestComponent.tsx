import { getTimezoneProfileSync } from "../lib/api/getTimezoneProfile"
import { Contact } from "../types"
import ContactEditor from "./ContactEditor"
import LocalTimeDisplay from "./LocalTimeDisplay"
import "./testComponent.scss"
import TimezoneDisplay from "./TimezoneDisplay"
import TimezoneSearch from "./TimezoneSearch"
import viteLogo from "/vite.svg"

function generateDebugContacts(count: number): Contact[] {
  const result: Contact[] = []

  for (let i = 0; i < count; i++) {
    result.push({
      id: i.toString(),
      name: "Contact " + "i".repeat(Math.random() * 25),
      timezone: "none",
      phoneNumber: "note",
    })
  }

  return result
}

export default function TestComponent() {
  const testContacts: Contact[] = generateDebugContacts(300)

  return (
    <div className="test-component">
      <div className="container styles-test">
        <p>Primary Container</p>

        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam
          quasi doloribus expedita corrupti. Provident praesentium culpa
          voluptate debitis ipsam quas suscipit sapiente aliquam nostrum! Minima
          ex provident aut adipisci repellendus? <a href="#">Link</a>
        </p>
        <p>
          <span className="color-accent">Accent Text</span>&nbsp;
          <span className="color-red">Red Text</span>&nbsp;
          <span className="color-green">Green Text</span>&nbsp;
          <span className="color-blue">Blue Text</span>&nbsp;
          <span className="color-yellow">Yellow Text</span>
        </p>
        <button>Button</button>
        <button className="primary">Primary Button</button>
        <button className="accent">Accent Button</button>
        <a href="#" className="link-button">
          Link Button
        </a>
        <button className="icon">
          <img src={viteLogo} />
          Icon Button
        </button>
        <form>
          <input type="text" name="" id="" />
          <div>
            <input type="checkbox" name="test-checkbox" id="" />
          </div>
          <input type="button" value="Form Button" />
          <input type="submit" value="Form Submit" />
        </form>
      </div>
      <div className="flex">
        <div className="container secondary">
          <h2>Secondary Container</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam
            quasi doloribus expedita corrupti. Provident praesentium culpa
            voluptate debitis ipsam quas suscipit sapiente aliquam nostrum!
            Minima ex provident aut adipisci repellendus?
          </p>
        </div>
        <div className="container accent">
          <h2>Accent Container</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam
            quasi doloribus expedita corrupti. Provident praesentium culpa
            voluptate debitis ipsam quas suscipit sapiente aliquam nostrum!
            Minima ex provident aut adipisci repellendus?
          </p>
        </div>
      </div>
      <div className="container">
        <h1>Components</h1>
        <h2>Timezone Display</h2>
        <LocalTimeDisplay seconds />
        <LocalTimeDisplay />
        <TimezoneSearch />
        <TimezoneDisplay
          timezone={getTimezoneProfileSync("Europe/Berlin")}
          contacts={testContacts}
        />
        <TimezoneDisplay
          timezone={getTimezoneProfileSync("America/Los_Angeles")}
          contacts={testContacts}
        />
        <TimezoneDisplay
          timezone={getTimezoneProfileSync("test")}
          contacts={testContacts}
        />
        <ContactEditor
          contact={{
            id: "test-id",
            name: "Test Contact",
            timezone: "Europe/Berlin",
            phoneNumber: "Some Note",
          }}
          newContact={true}
          updateCallback={() => {}}
        />
      </div>
    </div>
  )
}
