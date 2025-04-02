# Timezone Webapp Frontend

## To Setup

1. Open project in your code editor
2. Run `npm install`
3. Run `npm run dev` to run the development server

## To build

1. Run `npm run build`
   1. This builds the project into `/dist`
2. (TODO: Determine and test hosting the project)

# Frontend Organization

## Structure

Each page is made from some combination of basic HTML elements and reusable components. Globally shared state, such as user information, should be kept in `App.tsx` and passed around as a context. Pages and general components should only use the state they need, passing data down through props where necessary.

## Folders

- `src/components` - Contains shared components and their associated css files.
- `src/pages` - Contains components that are directly shown as pages. These may be larger and keep more of their own state.

## Other Files

- `src/App.tsx` - Contains the main layout for the applications as well as the global state
- `src/global.scss` - Contains global static variables. Import in other SCSS files with `@use "../globals.scss";`
- `src/index.scss` - Contains common CSS styles
- `src/main.tsx` - Contains the entry point for React
- `src/theme.scss` - Contains the color theme as CSS variables
- `src/types.ts` - Contains shared type definitions

# Components

## TimezoneDisplay

Component for displaying a single timezone with a list of associated contacts. It requires a [timezone identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) and a list of contacts. This list can optional be empty.

### Usage

```typescript
<TimezoneDisplay timezone="Europe/Berlin" contacts={contactsArray} />
```

## LocalTimeDisplay

Displays the local time and a search field to search for other timezones. It can optional hide the search field.

### Usage

```typescript
<LocalTimeDisplay />
```

```typescript
<LocalTimeDisplay hideSearch />
```

## ContactListItem

Displays a single contact item. This is meant to be used as a child component for [TimezoneDisplay](#timezonedisplay). The component takes an availability status and a contact object.

### Usage

```typescript
<ContactListItem contact={contact} availability={"available"} />
```
