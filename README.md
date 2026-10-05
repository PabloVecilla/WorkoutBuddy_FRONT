# WorkoutBuddy Frontend

WorkoutBuddy Frontend is the React client for WorkoutBuddy, a full-stack fitness application designed to help users create, manage, and complete personalized workout programs.

The application connects to the [WorkoutBuddy backend](https://github.com/PabloVecilla/WorkoutBuddy_BACK) and provides an authenticated workflow for generating programs, browsing workout days, replacing exercises, tracking active sessions, and logging completed sets.

## Project Goals

- Build a responsive single-page application with React
- Integrate a REST API through a reusable Axios client
- Implement authentication with JWT stored in HTTP-only cookies
- Protect private application routes and restore authenticated sessions
- Create and manage personalized training programs
- Support complete strength and cardio workout flows
- Build a reusable, component-based UI architecture
- Apply maintainable global design tokens and scoped CSS Modules

---

## Tech Stack

### Core

- React 19
- React Router 7
- Vite 8
- JavaScript (ES modules)

### API and State

- Axios
- React Context API
- REST API integration
- HTTP-only cookie authentication

### Styling

- CSS Modules
- Global design tokens with CSS custom properties
- Responsive layouts
- Accessible focus, contrast, and reduced-motion states

### Development Quality

- ESLint
- React Hooks lint rules
- Vite production builds

---

## Current Features

### Authentication

- User registration
- User login and logout
- Authentication state shared through React Context
- Session restoration through the current-user endpoint
- JWT cookie support through credentialed API requests
- Protected routes for authenticated users

### Program Management

- View all programs belonging to the authenticated user
- Generate a program from a name, goal, experience level, and weekly frequency
- View the workout days included in a program
- Delete a program and remove it from the dashboard immediately
- Navigate directly from a program to each scheduled workout

### Workout Sessions

- Load the exercises assigned to a workout
- Replace an exercise with an alternative from the same movement pattern
- Start a new workout session or resume an active one
- Display a live elapsed-time counter based on the server session start time
- Lock exercise replacement while a session is active
- Record and update individual sets
- Track weight and repetitions for strength exercises
- Track duration and intensity for cardio exercises
- Validate workout data before sending it to the API
- Finish a session, with confirmation when sets remain incomplete

### User Experience

- Responsive header with mobile navigation
- Loading, error, and empty-state components
- Retry actions for failed workout requests
- Success feedback after completing a session
- Custom not-found page
- Centralized dark-theme tokens for color, typography, spacing, shadows, borders, and interaction states

---

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/` | Public | Login page |
| `/register` | Public | User registration |
| `/dashboard` | Protected | User program dashboard |
| `/generate` | Protected | Program generator |
| `/programs/:id` | Protected | Program and workout-day details |
| `/programs/:programId/workout/:workoutId` | Protected | Workout session and set tracking |
| `*` | Public | Not-found fallback |

---

## Backend API Integration

All requests are sent through a shared Axios instance configured with `VITE_API_URL` and `withCredentials: true`.

### Authentication Routes

```text
POST /auth/register
POST /auth/login
GET  /auth/me
POST /auth/logout
```

### Program Routes

```text
GET    /programs/
POST   /programs/create
GET    /programs/:id
DELETE /programs/:id
```

### Workout and Exercise Routes

```text
GET   /programs/:programId/workouts/:workoutId/workout-exercises
PATCH /programs/:programId/workouts/:workoutId/workout-exercises/:workoutExerciseId
GET   /exercises/movement-pattern/:movementPattern
```

### Session and Set Routes

```text
POST  /programs/:programId/workouts/:workoutId/sessions
PATCH /workout-sessions/:sessionId/sets/:setId
PATCH /workout-sessions/:sessionId/finish
```

---

## Project Structure

```text
src/
├── api/          # Shared Axios client
├── assets/       # Static assets bundled by Vite
├── components/   # Reusable exercise, set, header, and UI components
├── context/      # Global authentication state
├── hooks/        # Reusable React hooks, including the workout timer
├── layouts/      # Shared and protected route layouts
├── pages/        # Route-level application screens
├── services/     # Feature-specific API functions
├── styles/       # Global tokens, reset, and base styles
├── App.jsx       # Application route definitions
└── main.jsx      # React entry point
```

Component-specific styles live beside their components as CSS Modules. Application-wide values and browser defaults are centralized in `src/styles`.

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_API_URL=http://localhost:3000
```

For a deployed environment, replace the value with the public URL of the WorkoutBuddy backend.

Because authentication uses HTTP-only cookies, the backend must allow the frontend origin and credentialed CORS requests.

---

## Run Locally

### Prerequisites

- Node.js `24.0+`
- npm `11.0+`
- A running [WorkoutBuddy backend](https://github.com/PabloVecilla/WorkoutBuddy_BACK)

### Clone the repository

```bash
git clone https://github.com/PabloVecilla/WorkoutBuddy_FRONT.git
cd WorkoutBuddy_FRONT
```

### Install dependencies

```bash
npm install
```

### Configure the API URL

```bash
cp .env.example .env.local
```

Update `VITE_API_URL` in `.env.local` so it points to the backend instance.

### Start the development server

```bash
npm run dev
```

Vite serves the application at `http://localhost:5173` by default.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server with hot module replacement |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## Production Build

```bash
npm run lint
npm run build
npm run preview
```

The current codebase passes ESLint and completes a Vite production build successfully.

---

## Development Status

WorkoutBuddy is under active development. The principal end-to-end flow is implemented, from authentication and program generation to workout completion and set tracking.

Potential next steps include:

- Automated unit, component, and end-to-end tests
- Workout history and progress visualization
- Program editing from the frontend
- Improved form validation and user-facing feedback
- Production deployment and continuous integration for the frontend

---

## Learning Goals

This project is being developed as a learning-focused full-stack application with emphasis on:

- React component architecture
- Client-side routing and protected navigation
- Authentication and browser cookie behavior
- REST API integration
- Asynchronous state and error handling
- Responsive and accessible interface design
- Frontend and backend integration workflows

---

## Related Repository

- [WorkoutBuddy Backend](https://github.com/PabloVecilla/WorkoutBuddy_BACK)
