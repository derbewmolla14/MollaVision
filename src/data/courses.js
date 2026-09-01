export const courses = [
  {
    id: "html",
    title: "HTML",
    description: "Learn the structure of modern web pages.",
    level: "Beginner",
    lessons: 30,
    icon: "🏗️",
    category: "programming"
  },
  {
    id: "css",
    title: "CSS",
    description: "Learn how to style responsive websites.",
    level: "Beginner",
    lessons: 40,
    icon: "🎨",
    category: "programming"
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Learn programming and make websites interactive.",
    level: "Beginner",
    lessons: 50,
    icon: "⚡",
    category: "programming"
  },
  {
    id: "react",
    title: "React",
    description: "Build modern user interfaces with React.",
    level: "Intermediate",
    lessons: 45,
    icon: "⚛️",
    category: "frontend"
  },
  {
    id: "nodejs",
    title: "Node.js",
    description: "Learn server-side JavaScript development.",
    level: "Intermediate",
    lessons: 35,
    icon: "🟢",
    category: "backend"
  },
  {
    id: "express",
    title: "Express.js",
    description: "Build powerful APIs and web servers.",
    level: "Intermediate",
    lessons: 30,
    icon: "🚀",
    category: "backend"
  },
  {
    id: "mongodb",
    title: "MongoDB",
    description: "Learn NoSQL database design and management.",
    level: "Intermediate",
    lessons: 28,
    icon: "🌿",
    category: "database"
  },
  {
    id: "typescript",
    title: "TypeScript",
    description: "Master typed JavaScript for scalable applications.",
    level: "Intermediate",
    lessons: 32,
    icon: "🔷",
    category: "programming"
  },
  {
    id: "python",
    title: "Python",
    description: "Learn Python from basics to advanced concepts.",
    level: "Beginner",
    lessons: 40,
    icon: "🐍",
    category: "programming"
  },
  {
    id: "sql",
    title: "SQL",
    description: "Master relational databases and queries.",
    level: "Beginner",
    lessons: 25,
    icon: "📊",
    category: "database"
  },
  {
    id: "git",
    title: "Git & GitHub",
    description: "Version control and collaboration essentials.",
    level: "Beginner",
    lessons: 20,
    icon: "📦",
    category: "tools"
  },
  {
    id: "webdev",
    title: "Web Development",
    description: "Complete guide to modern web development.",
    level: "Intermediate",
    lessons: 60,
    icon: "🌐",
    category: "fullstack"
  },
  {
    id: "java",
    title: "Java",
    description: "Learn object-oriented programming with Java.",
    level: "Intermediate",
    lessons: 48,
    icon: "☕",
    category: "programming"
  },
  {
    id: "cpp",
    title: "C++",
    description: "Master systems programming with C++.",
    level: "Advanced",
    lessons: 52,
    icon: "⚙️",
    category: "programming"
  },
  {
    id: "excel",
    title: "Microsoft Excel",
    description: "Data analysis and spreadsheet mastery.",
    level: "Beginner",
    lessons: 22,
    icon: "📈",
    category: "productivity"
  },
];

export const getCoursesByCategory = (category) => {
  return courses.filter(course => course.category === category);
};

export const getCourseById = (id) => {
  return courses.find(course => course.id === id);
};
