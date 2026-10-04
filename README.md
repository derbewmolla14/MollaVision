# MollaVision - Online Learning Platform

A modern educational platform for learning programming, web development, and technology skills. Built with React, Vite, Tailwind CSS, Express, and MongoDB.

## Features

- **Home Page** - Hero section, course preview, and statistics
- **Courses Page** - Browse and filter courses by category and level
- **Course Details** - View detailed course information and lesson outline
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Interactive Components** - Reusable components for buttons, cards, badges, etc.
- **Authentication foundation** - Registration, login, logout, persistent HTTP-only JWT sessions, and role-aware routes
- **Persistent content foundation** - Mongoose models and protected course, lesson, progress, and admin statistics APIs

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Badge.jsx
│   ├── layout/          # Layout components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   └── course/          # Course-related components
│       └── CourseCard.jsx
├── pages/               # Page components
│   ├── Home.jsx
│   ├── Courses.jsx
│   ├── CourseDetails.jsx
│   ├── Practice.jsx
│   ├── Projects.jsx
│   ├── Dashboard.jsx
│   ├── Certificates.jsx
│   ├── Login.jsx
│   └── NotFound.jsx
├── data/                # Data files
│   └── courses.js
├── App.jsx              # Main app component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles

server/
├── config/              # Database configuration
├── controllers/         # API behavior
├── middleware/          # Authentication and authorization
├── models/              # Mongoose models
├── routes/              # REST endpoints
└── scripts/             # Safe data migration scripts

```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **JavaScript (ES6+)** - Programming language
- **Express and Mongoose** - Backend API and MongoDB persistence
- **JWT and bcryptjs** - Authentication and password hashing

## Installation

1. Clone the repository:
```bash
cd MollaVision
```

2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and set `MONGODB_URI` and a long random `JWT_SECRET`. Never commit `.env`.

4. Start the frontend:
```bash
npm run dev
```

5. In a second terminal, start the API:
```bash
npm run server:dev
```

The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:5000`.

## Environment variables

The backend reads `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`, and `NODE_ENV`. The frontend reads `VITE_API_URL` when it is set; otherwise it uses `http://localhost:5000/api` for local development. Storage variable names are included in `.env.example` for the upcoming cloud upload adapter.

## Migrating the existing catalog

The current static catalog is not deleted or replaced. After configuring MongoDB, run:

```bash
npm run migrate:courses
```

The migration upserts courses by their existing stable ids and lessons by course/order. It can be rerun safely and must complete successfully before switching any page from static fallback data to API data.

## Deployment

- **Vercel:** build with `npm run build`; set `VITE_API_URL` to the deployed API base URL.
- **Render/Railway:** start with `npm run server`; set `MONGODB_URI`, `JWT_SECRET`, `PORT`, `CLIENT_URL`, and `NODE_ENV=production`.
- **MongoDB Atlas:** create a database user with the minimum required permissions and add the Atlas connection string only to the backend environment.
- **Storage:** configure the selected video/object-storage provider only on the backend. Private resource URLs must be issued by authorized API routes, never by frontend environment variables.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## Available Pages

- `/` - Home page
- `/courses` - All courses listing
- `/courses/:courseId` - Course details
- `/practice` - Practice problems
- `/projects` - Projects gallery
- `/dashboard` - Student dashboard
- `/certificates` - Certificates
- `/login` - Login page

## Next implementation phase

- Course lesson pages with code examples
- Interactive code playground
- Exercises and practice problems
- Authentication system
- User dashboard with progress tracking
- Certificates
- Cloud PDF/PPT/PPTX/video upload adapters and authorized download routes
- Admin course/lesson editor forms and enrollment management
- API-backed course and lesson rendering with static fallback during migration
- MongoDB-backed student progress UI and premium enrollment flows

## Contributing

This project is currently in development. New features and improvements are being added regularly.

## License

All rights reserved - MollaVision © 2024
