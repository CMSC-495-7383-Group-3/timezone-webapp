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
+ `src/components` - Contains shared components and their associated css files.
+ `src/pages` - Contains components that are directly shown as pages. These may be larger and keep more of their own state.

## Other Files
+ `src/App.tsx` - Contains the main layout for the applications as well as the global state
+ `src/global.scss` - Contains global static variables. Import in other SCSS files with `@use "../globals.scss";`
+ `src/index.scss` - Contains common CSS styles
+ `src/main.tsx` - Contains the entry point for React
+ `src/theme.scss` - Contains the color theme as CSS variables
+ `src/types.ts` - Contains shared type definitions

# Components
TODO