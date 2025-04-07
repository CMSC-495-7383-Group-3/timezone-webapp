# Timezone Webapp Frontend

> [!IMPORTANT]  
> Any commands here are assumed to be relative to the `/frontend` folder. Open it directly in a code editor or cd into it on a terminal.

## To Setup

1. Open project in your code editor
2. Run `npm install`
3. Run `npm run dev` to run the development server

## To build

1. Run `npm run build`
   1. This builds the project into `/dist`
2. (TODO: Determine and test hosting the project)

## To Test

TODO

# Frontend Organization

## Structure

Each page is made from some combination of basic HTML elements and reusable components. Globally shared state, such as user information, should be kept in `App.tsx` and passed around as a context. Pages and general components should only use the state they need, passing data down through props where necessary.

## Folders

- `src/components` - Contains shared components and their associated css files.
- `src/context` - Contains the definition for contexts that can be used to pass data around the application.
- `src/lib` - Contains any global shared functions. If a function is static, and especially if it is needed by more than one component, it should be represented as its own file here. It is encuraged to make one file per function.
  - `src/lib/api` - Contains functions that do an API call. Components should use functions in this folder for API calls instead of doing it themselves. Keeping these functions separated will make it easier respond to changes in the API implementation.
- `src/pages` - Contains components that are directly shown as pages. These may be larger and keep more of their own state.

## Other Files

- `src/App.tsx` - Contains the main layout for the applications as well as the global state
- `src/global.scss` - Contains global static variables. Import in other SCSS files with `@use "../globals.scss";`
- `src/index.scss` - Contains common CSS styles
- `src/main.tsx` - Contains the entry point for React
- `src/theme.scss` - Contains the color theme as CSS variables
- `src/types.ts` - Contains shared type definitions

## Available Contexts

- `AuthContext` - Provides information about authentication. WIP
- `ContactEditorContext` - Provided an interface for opening the contact editor.

# Tips

## Opening the Contact Editor

The contact editor is available using the `ContactEditorContext` on every page. The function to invoke it takes a contact which will be updated. Importantly, saving will update the data on the database as well as the fields of the object that were passed to the function. An example is as follows:

```typescript
import { ContactEditorContext } from "../context/contactEditorContext"
import { Contact } from "../types"

// ***

const editorContext = useContext(ContactEditorContext)
const exampleContact: Contact = {} // (Default fields are omitted here)

// This opens the editor as a modal above everything else.
// On save, the data inside exampleContact is edited as well as an API call.
editorContext.openEditor(exampleContact)
```

## Timezone vs TimezoneProfile

**The details of this are subject to change as the API gets implemented.**

A `timezone` is the string representation of a timezone, for example `"Europe/Berlin"` and `"America/Los_Angeles"`. This may be replaced with the API's id/key for timezones.

A `TimezoneProfile` is an object that stores some information about a given timezone such as the name and sunset/rise times.

The naming of what is used where is currently a bit ambiguous, but the type checking system should catch all errors. As the details on this are better decided, please change any naming of variables and parameters as needed.

## Testing

To test the application, the development server must be running (`npm run dev`). Then use `npm run test` to run automated tests or `npm run cp:open` to open the visual testing environment.

# Components

## ContactEditor

An editor for contacts. Provides a form for editing and saving. The component has an optional callback when used for when the close button is pressed. It also has a mode for adding new contacts, which changes some of the text.

The form will automatically attempt to close on save unless it is specified no to.

Importantly, on save, this component will make an API call as well as writing back to the contact passed in its props.

### Usage

```tsx
<ContactEditor
  contact={editedContact}
  newContact={false}
  closeEditorCallback={onCloseContactEditor}
  keepOpenOnSave
/>
```

## ContactEditorModal

> [!WARNING]  
> Not intended for direct use.

This component provides the `ContactEditorContext` as well as the display for the `ContactEditor` modal. This component should only be used once within `App.tsx`.

### Usage

```tsx
<ContactEditorModal>{/* The rest of the application */}</ContactEditorModal>
```

## ContactList

> [!WARNING]  
> Not intended for direct use.

This component displays a list of timezones, usually as a child of [TimezoneDisplay](#timezonedisplay)

### Usage

```tsx
<ContactList contacts={props.contacts} time={new Date()} />
```

## ContactListItem

> [!WARNING]  
> Not intended for direct use.

Displays a single contact item. This is meant to be used as a child component for [ContactList](#contactlist). The component takes an availability status and a contact object.

### Usage

```tsx
<ContactListItem contact={contact} availability={"available"} />
```

## LocalTimeDisplay

Displays the local time. This can optionally have child components, such as a [TimeZoneSearch](#timezonesearch) that will be shown along the time. By passing the seconds prop, the time will also show the seconds.

### Usage

```tsx
<LocalTimeDisplay seconds />
```

```tsx
<LocalTimeDisplay>
  <TimeZoneSearch />
</LocalTimeDisplay>
```

## Nav

WIP Component. Will show the navigation bar for the top of the page.

## TestComponent

Testing Component. Shows examples of most components and CSS styles.

## TimezoneDisplay

Component for displaying a single timezone with a list of associated contacts. It requires a TimezoneProfile and a list of contacts. Adding the hideContactsList prop will hide the list of contacts.

Optionally, children can be added to this component, which will be shown along with the time.

### Usage

```tsx
<TimezoneDisplay timezone={timezoneProfile} contacts={contacts} />
```

## TimezoneSearch

A search form for timezones. This is hard coded to limit the search results to 10.

TODO: May allow favoring directly from the list of results.

### Usage

```tsx
<TimeZoneSearch />
```

## TimezoneSearchResult

> [!WARNING]  
> Not intended for direct use.

A single result for the timezone search. Provides a link to that timezone's page.

### Usage

```tsx
<TimezoneSearchResult timezone={tz} />
```

### Timezone Dashboard

- Description: Component for displaying multiple timezones with their clocks and associated contacts on the Dashboard page (`/dashboard`). Uses `TimezoneDisplay` for each timezone entry.
  - Usage: `<TimezoneDashboard />`
  - Details:
    - Currently shows a static list of timezones (e.g., "America/New_York", "Europe/London") with mock contact data.
    - Styled with `timezoneDashboard.scss` for layout and `timeZoneDisplay.scss` for individual timezone cards.
    - Integrated into the navigation bar via a "Dashboard" link in `Nav.tsx`.
  - Future Potential: Could support timezone categorization (e.g., grouping by region or tags like "Work") with filters, leveraging the `setFavorite` API for prioritization.
    How to Add It
