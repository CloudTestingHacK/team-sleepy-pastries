# Implementation Plan: The Rolling Scone 🥐
**Project Name:** The Rolling Scone (A Pastry Crawl Generator)
**Tech Stack:** React, Next.js (App Router), Tailwind CSS (for modern/clean styling)
**Accessibility Target:** WCAG 2.2 AA Compliance

## 1. Project Overview
"The Rolling Scone" is a web application that generates "pastry crawls" (similar to pub crawls, but for bakeries). The app features a landing page, a multi-step form to gather user preferences, and a generated output page displaying the route, calorie estimates, and map integrations.

## 2. Core Principles & Guardrails for Copilot
When generating code for this project, always adhere to the following:
* **Accessibility First:** Ensure all inputs have associated `<label>` elements, use `aria-` attributes where state changes dynamically, ensure focus management between form steps, and verify contrast ratios for a "modern and clean" design.
* **Modern Design:** Use Tailwind CSS to create an airy, clean, bakery-inspired aesthetic (e.g., warm whites, butter yellows, pastry-crust browns).
* **Humor:** Strictly include silly pastry puns on *every page* of the form (suggestions provided in Phase 3).
* **Mobile Responsive:** The multi-page form and output maps must be usable on mobile devices.

---

## 3. Step-by-Step Implementation Phases

### Phase 1: Setup & Landing Page
1.  **Initialize Layout:** Create the root layout with a sticky header and a clean, warm color palette.
2.  **Landing Page (`/page.tsx`):**
    * **Hero Section:** Define what a pastry crawl is (e.g., "Like a pub crawl, but sweeter. Swap the pints for pastries and the hangovers for sugar rushes!").
    * **Call to Action:** Create a highly visible, accessible button labeled **"Butter me up"**.
    * **Routing:** The "Butter me up" button must push the user to the form page (`/crawl-setup`).

### Phase 2: Multi-Step Form Wrapper (`/crawl-setup`)
1.  **State Management:** Create a parent client component to hold the form state:
    * `startAddress` (string)
    * `numberOfStops` (number)
    * `maxDistance` (number, default to 5, range 1-42)
    * `currentStep` (number, 1 to 3)
2.  **Step Navigation:** Ensure users can step forward and backward without losing data. 
3.  **Accessibility:** Announce step changes to screen readers using `aria-live`.

### Phase 3: Form Steps (The "Proofing" Stage)
Create three separate sub-components for the form steps.

* **Step 1: Start Address**
    * **Input:** Text field for the starting location.
    * **Pun Integration:** Include a heading or subtext like: *"Don't go baking my heart, where are we starting?"* or *"Let's get ready to crumble. Enter your starting point."*
    * **Validation:** Must not be empty.

* **Step 2: Number of Stops**
    * **Input:** Number input or plus/minus counter for pastry stops.
    * **Pun Integration:** Include a heading or subtext like: *"Muffin compares to you. How many stops are we making?"* or *"You're the apple of my pie, how many bakeries?"*
    * **Validation:** Must be greater than 0.

* **Step 3: Max Walking Distance**
    * **Input:** A sliding scale (`<input type="range">`) from `1` to `42` (representing kilometers). Display the current selected value dynamically.
    * **Pun Integration:** Include a heading or subtext like: *"Croissant we walk a little further? Set your max distance."* or *"Let's roll! How many kilometers can you handle?"*
    * **Action:** Provide a "Generate" button that submits the form and routes to `/route-results`.

### Phase 4: Output Page (`/route-results`)
1.  **Data Retrieval:** Retrieve the user's inputs from state or URL search parameters.
2.  **Mock Data Generation:** Create a mock function `generatePastryRoute(address, stops, distance)` that returns a dummy array of bakery objects (Name, Address, Pastry Specialty).
3.  **Calorie Calculator Component:**
    * **Math Logic:** * `Estimated Calories In` = `numberOfStops * 400` (assuming 400 calories per average pastry).
        * `Estimated Calories Burned` = `maxDistance * 60` (rough estimate of 60 calories burned per km walked).
    * **UI:** Display these two numbers side-by-side in a fun, visual way (e.g., a "Guilt-O-Meter" or "The Net Damage").
4.  **Bakery List Component:**
    * Render the list of generated bakeries cleanly using a card layout.
5.  **Mapping Solution (Developer Check Required):**
    * *Hey Copilot: For this section, generate a UI wrapper for the map, but leave a clear comment block discussing the options with the developer.*
    * **Option A (Free/Simple):** Generate a Google Maps Directions URL that opens in a new tab with the start address and bakeries as waypoints.
    * **Option B (Embedded/Requires API Key):** Integrate `@react-google-maps/api` to show the route directly on the page.
    * **Action:** Implement Option A as the default fallback with a button that says "Open Route in Google Maps", but prompt the developer to choose if they want to upgrade to Option B.

### Phase 5: Polish & WCAG 2.2 Audit
* **Focus States:** Ensure all buttons, links, and the range slider have distinct `:focus-visible` outlines.
* **Target Size:** Ensure the slider handle, "Butter me up" button, and next/prev buttons meet the minimum 24x24 CSS pixel target size required by WCAG 2.2.
* **Error Handling:** Add accessible error messages if a user tries to proceed without filling out a form step.