# MollaVision - Online Learning Platform

A modern educational platform for learning programming, web development, and technology skills. Built with React, Vite, and Tailwind CSS.

## Features

- **Home Page** - Hero section, course preview, and statistics
- **Courses Page** - Browse and filter courses by category and level
- **Course Details** - View detailed course information and lesson outline
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern UI** - Clean, professional design with Tailwind CSS
- **Interactive Components** - Reusable components for buttons, cards, badges, etc.

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

```

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **JavaScript (ES6+)** - Programming language

## Installation

1. Clone the repository:
```bash
cd MollaVision
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:3000`

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

## Future Features (Stage 2-5)

- Course lesson pages with code examples
- Interactive code playground
- Exercises and practice problems
- Authentication system
- User dashboard with progress tracking
- Certificates
- Backend integration with Node.js/Express/MongoDB

## Contributing

This project is currently in development. New features and improvements are being added regularly.

## License

All rights reserved - MollaVision © 2024
