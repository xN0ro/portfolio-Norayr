# Portfolio — Norayr Petrosyan

My personal portfolio website built with Next.js for the Web Development course at La Cité (Dr. Bakary Diarra).

## About

This is a full-stack portfolio that showcases my projects, skills and experience. Visitors can register, login, browse my projects and leave testimonials. All pages except login and register are protected — you need to be logged in to see them.

I work as a sales professional at Toyota Gatineau and I'm also a computer programming student at La Cité. This portfolio shows both my technical skills and my business experience.

## Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS
- **State Management:** Redux Toolkit (with createAsyncThunk for API calls)
- **Backend:** Next.js API Routes
- **Database:** SQLite (better-sqlite3)
- **Auth:** JWT tokens + bcryptjs for password hashing
- **Styling:** Tailwind CSS + custom CSS with Google Fonts (Syne, DM Sans, JetBrains Mono)

## Features

- Home page with bio, skills, and profile photo
- Header with navigation + footer with GitHub/LinkedIn links
- 3 project pages with descriptions and technologies (data comes from the API)
- Login and Register pages with form validation (red error messages)
- Testimonials — visitors can leave, edit, and delete their own messages
- All pages protected except login and register
- Redux Toolkit used for all state management
- Fully responsive (mobile, tablet, desktop)
- Dark theme with animations

## How to Run

```bash
# clone the repo
git clone https://github.com/xN0ro/portfolio-norayr.git
cd portfolio-norayr

# install dependencies
npm install

# start dev server
npm run dev

# open http://localhost:3000
```

The database gets created automatically when you first run the app. It also seeds the 3 default projects.

## Project Structure

```
portfolio-norayr/
├── components/        — Header, Footer, Layout, ProtectedRoute
├── lib/               — Database setup, auth helpers, validators
├── pages/
│   ├── api/           — Backend API routes (auth, projects, testimonials)
│   ├── projects/      — Projects list + detail pages
│   ├── testimonials/  — List, create, edit testimonial pages
│   ├── index.js       — Home page
│   ├── login.js       — Login page
│   └── register.js    — Register page
├── store/             — Redux slices (auth, projects, testimonials)
├── styles/            — Global CSS
└── public/            — Images
```

## Screenshots

### Login
![Login](screenshots/login.png)

### Register
![Register](screenshots/register.png)

### Home Page
![Home](screenshots/home.png)

### Projects
![Projects](screenshots/projects.png)

### Project Detail
![Project Detail](screenshots/project-detail.png)

### Testimonials
![Testimonials](screenshots/testimonials.png)

### New Testimonial
![New Testimonial](screenshots/new-testimonial.png)

## Validation

All forms have validation on both the frontend (before submitting) and backend (in the API routes). Error messages show up in red under the fields. Rules:

- Name: required, min 2 characters
- Email: required, must be valid format
- Password: required, min 6 characters
- Confirm Password: must match
- Testimonial message: required, between 10 and 1000 characters

## Redux

Using Redux Toolkit with 3 slices:
- `authSlice` — login, register, logout, check auth
- `projectsSlice` — fetch all projects, fetch by slug
- `testimonialsSlice` — full CRUD (create, read, update, delete)

All API communication goes through `createAsyncThunk` with fetch.

## Route Protection

Every page except `/login` and `/register` is wrapped in a `ProtectedRoute` component. If you're not logged in, it redirects you to the login page. The app checks for a saved JWT token when it loads.

## Author

**Norayr Petrosyan**
- GitHub: https://github.com/xN0ro
- LinkedIn: https://www.linkedin.com/in/norayr-petrosyan-044303231/
- Location: Gatineau, QC
