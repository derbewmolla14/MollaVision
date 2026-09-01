export const lessons = [
  // ========== HTML Course ==========
  {
    id: "html-introduction",
    courseId: "html",
    title: "HTML Introduction",
    order: 1,
    module: "Getting Started",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Introduction"
      },
      {
        type: "text",
        text: "HTML stands for HyperText Markup Language. It is the standard markup language for creating web pages. HTML provides the structure and content of web pages, while CSS handles styling and JavaScript handles interactivity."
      },
      {
        type: "heading",
        level: 2,
        text: "What is HTML?"
      },
      {
        type: "text",
        text: "HTML is used to describe the structure and content of a webpage. It uses a system of tags (also called elements) to tell the browser how to display the content. Each tag has a specific purpose and meaning."
      },
      {
        type: "text",
        text: "For example, the <h1> tag is used for main headings, the <p> tag is used for paragraphs, and the <a> tag is used for links."
      },
      {
        type: "heading",
        level: 2,
        text: "A Simple HTML Example"
      },
      {
        type: "code",
        language: "html",
        code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    <h1>Hello MollaVision</h1>
    <p>This is my first HTML page.</p>
</body>
</html>`
      },
      {
        type: "text",
        text: "The above example shows the basic structure of an HTML document. Every HTML document should have this structure to be valid."
      },
      {
        type: "note",
        text: "HTML is not a programming language — it's a markup language used to structure content on the web."
      }
    ],
    exercise: "html-intro-exercise"
  },
  {
    id: "html-editors",
    courseId: "html",
    title: "HTML Editors",
    order: 2,
    module: "Getting Started",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Editors"
      },
      {
        type: "text",
        text: "HTML files are plain text files, so you can write them using any text editor. However, some editors are specifically designed for web development and make it easier to write HTML."
      },
      {
        type: "heading",
        level: 2,
        text: "Popular HTML Editors"
      },
      {
        type: "text",
        text: "Here are some popular editors for writing HTML:"
      },
      {
        type: "list",
        items: [
          "Visual Studio Code — Free, powerful, and widely used",
          "Sublime Text — Lightweight and fast",
          "Atom — Built on web technologies (now archived)",
          "WebStorm — Professional IDE (paid)",
          "Notepad++ — Simple and free"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Getting Started with Visual Studio Code"
      },
      {
        type: "text",
        text: "Visual Studio Code (VS Code) is the most popular choice for web developers. It's free, lightweight, and has excellent HTML support."
      },
      {
        type: "text",
        text: "After installing VS Code, you can create a new file with the .html extension and start writing HTML code. VS Code will automatically provide helpful suggestions as you type."
      },
      {
        type: "tip",
        text: "Install the 'Live Server' extension in VS Code to see your HTML changes instantly in the browser."
      }
    ]
  },
  {
    id: "html-basic",
    courseId: "html",
    title: "HTML Basic",
    order: 3,
    module: "Getting Started",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Basic Structure"
      },
      {
        type: "text",
        text: "Every HTML document follows a basic structure. Understanding this structure is fundamental to writing correct HTML code."
      },
      {
        type: "heading",
        level: 2,
        text: "The HTML Document Structure"
      },
      {
        type: "code",
        language: "html",
        code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is a paragraph.</p>
</body>
</html>`
      },
      {
        type: "heading",
        level: 2,
        text: "What Each Part Means"
      },
      {
        type: "text",
        text: "Let's break down each part of the HTML structure:"
      },
      {
        type: "list",
        items: [
          "<!DOCTYPE html> — Declares this as an HTML5 document",
          "<html> — Root element that contains all other elements",
          "<head> — Contains metadata about the page (not visible to users)",
          "<title> — Sets the page title shown in the browser tab",
          "<body> — Contains all visible page content",
          "<meta charset> — Specifies character encoding (UTF-8)",
          "<meta viewport> — Makes the page responsive"
        ]
      },
      {
        type: "note",
        text: "The DOCTYPE declaration must be the first line of every HTML document."
      }
    ]
  },
  {
    id: "html-elements",
    courseId: "html",
    title: "HTML Elements",
    order: 4,
    module: "HTML Content",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Elements"
      },
      {
        type: "text",
        text: "An HTML element is defined by a start tag, content, and an end tag. HTML elements tell the browser how to display the content."
      },
      {
        type: "heading",
        level: 2,
        text: "Anatomy of an HTML Element"
      },
      {
        type: "code",
        language: "html",
        code: `<tagname>Content goes here...</tagname>`
      },
      {
        type: "text",
        text: "An HTML element consists of:"
      },
      {
        type: "list",
        items: [
          "Opening tag: <tagname>",
          "Content: The text or data inside the tag",
          "Closing tag: </tagname>"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Examples of HTML Elements"
      },
      {
        type: "code",
        language: "html",
        code: `<h1>This is a heading</h1>
<p>This is a paragraph.</p>
<a href="https://www.example.com">This is a link</a>`
      },
      {
        type: "heading",
        level: 2,
        text: "Nested Elements"
      },
      {
        type: "text",
        text: "You can put HTML elements inside other elements. This is called nesting. Always make sure to close nested tags in the correct order."
      },
      {
        type: "code",
        language: "html",
        code: `<body>
  <div>
    <h1>MollaVision</h1>
    <p>Learn web development online.</p>
  </div>
</body>`
      },
      {
        type: "warning",
        text: "Always close tags properly. Incorrect nesting can cause unexpected behavior."
      }
    ],
    exercise: "html-elements-exercise"
  },
  {
    id: "html-attributes",
    courseId: "html",
    title: "HTML Attributes",
    order: 5,
    module: "HTML Content",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Attributes"
      },
      {
        type: "text",
        text: "Attributes provide additional information about HTML elements. They are always specified in the opening tag and provide extra details about how the element should behave."
      },
      {
        type: "heading",
        level: 2,
        text: "Syntax"
      },
      {
        type: "code",
        language: "html",
        code: `<tag attribute="value">Content</tag>`
      },
      {
        type: "heading",
        level: 2,
        text: "Common Attributes"
      },
      {
        type: "list",
        items: [
          "href — URL for links",
          "src — Source for images",
          "alt — Alternative text for images",
          "class — CSS class name",
          "id — Unique identifier",
          "title — Tooltip text",
          "style — Inline CSS styles"
        ]
      },
      {
        type: "heading",
        level: 2,
        text: "Examples"
      },
      {
        type: "code",
        language: "html",
        code: `<!-- Link with href attribute -->
<a href="https://www.mollavision.com">Visit MollaVision</a>

<!-- Image with src and alt attributes -->
<img src="image.jpg" alt="A beautiful sunset">

<!-- Element with class attribute -->
<p class="important">This is important.</p>

<!-- Element with id attribute -->
<div id="main-content">Main content here</div>`
      },
      {
        type: "tip",
        text: "Always include the 'alt' attribute for images. It helps users who can't see images and improves accessibility."
      }
    ]
  },
  {
    id: "html-headings",
    courseId: "html",
    title: "HTML Headings",
    order: 6,
    module: "HTML Content",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Headings"
      },
      {
        type: "text",
        text: "HTML headings are used to define titles and subtitles. There are six levels of headings, from <h1> (most important) to <h6> (least important)."
      },
      {
        type: "heading",
        level: 2,
        text: "Heading Levels"
      },
      {
        type: "code",
        language: "html",
        code: `<h1>This is heading 1</h1>
<h2>This is heading 2</h2>
<h3>This is heading 3</h3>
<h4>This is heading 4</h4>
<h5>This is heading 5</h5>
<h6>This is heading 6</h6>`
      },
      {
        type: "heading",
        level: 2,
        text: "Best Practices"
      },
      {
        type: "list",
        items: [
          "Use <h1> only once per page for the main title",
          "Use headings in logical order (don't skip levels)",
          "Use headings for content structure, not styling",
          "Keep headings concise and descriptive"
        ]
      },
      {
        type: "note",
        text: "Using headings correctly improves SEO and helps screen readers understand your page structure."
      }
    ]
  },
  {
    id: "html-paragraphs",
    courseId: "html",
    title: "HTML Paragraphs",
    order: 7,
    module: "HTML Content",
    content: [
      {
        type: "heading",
        level: 1,
        text: "HTML Paragraphs"
      },
      {
        type: "text",
        text: "The <p> tag defines a paragraph in HTML. A paragraph is a block of text separated from other blocks by blank lines."
      },
      {
        type: "heading",
        level: 2,
        text: "The Paragraph Tag"
      },
      {
        type: "code",
        language: "html",
        code: `<p>This is a paragraph.</p>
<p>This is another paragraph.</p>`
      },
      {
        type: "heading",
        level: 2,
        text: "How Browsers Handle Spaces"
      },
      {
        type: "text",
        text: "HTML automatically removes extra spaces and line breaks. Multiple spaces and line breaks are treated as a single space."
      },
      {
        type: "code",
        language: "html",
        code: `<p>This   paragraph
has        extra     spaces
and line breaks.</p>`
      },
      {
        type: "text",
        text: "The above code will display as a single line of text with single spaces between words."
      },
      {
        type: "heading",
        level: 2,
        text: "Line Breaks"
      },
      {
        type: "text",
        text: "To create line breaks, use the <br> tag (self-closing tag):"
      },
      {
        type: "code",
        language: "html",
        code: `<p>This is a line<br>And this is a new line</p>`
      }
    ]
  }
];

export const getLessonsByModule = (courseId) => {
  return lessons
    .filter(lesson => lesson.courseId === courseId)
    .reduce((modules, lesson) => {
      const moduleIndex = modules.findIndex(m => m.name === lesson.module);
      if (moduleIndex === -1) {
        modules.push({
          name: lesson.module,
          lessons: [lesson]
        });
      } else {
        modules[moduleIndex].lessons.push(lesson);
      }
      return modules;
    }, []);
};

export const getLessonById = (courseId, lessonId) => {
  return lessons.find(lesson => lesson.courseId === courseId && lesson.id === lessonId);
};

export const getLessonsByOrder = (courseId) => {
  return lessons
    .filter(lesson => lesson.courseId === courseId)
    .sort((a, b) => a.order - b.order);
};

export const getNextLesson = (courseId, currentOrder) => {
  const allLessons = getLessonsByOrder(courseId);
  const nextLesson = allLessons.find(lesson => lesson.order === currentOrder + 1);
  return nextLesson || null;
};

export const getPreviousLesson = (courseId, currentOrder) => {
  const allLessons = getLessonsByOrder(courseId);
  const prevLesson = allLessons.find(lesson => lesson.order === currentOrder - 1);
  return prevLesson || null;
};

export const getTotalLessons = (courseId) => {
  return lessons.filter(lesson => lesson.courseId === courseId).length;
};
