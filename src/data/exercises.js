export const exercises = [
  {
    id: "html-intro-exercise",
    lessonId: "html-introduction",
    courseId: "html",
    title: "Create Your First HTML Page",
    question: "Create an HTML document with a heading 'Welcome to MollaVision' and a paragraph 'I am learning HTML'. Make sure to include the basic HTML structure.",
    initialCode: `<!DOCTYPE html>
<html>
<head>
    <title>My First Page</title>
</head>
<body>
    
</body>
</html>`,
    expectedOutput: "Welcome to MollaVision",
    difficulty: "beginner",
    type: "html",
    hint: "Use <h1> for the heading and <p> for the paragraph.",
    explanation: "This exercise teaches you how to create a basic HTML structure and add content using tags.",
    validator: (code) => {
      const hasH1 = code.includes("<h1>") && code.includes("</h1>");
      const hasParagraph = code.includes("<p>") && code.includes("</p>");
      const hasWelcome = code.toLowerCase().includes("welcome to mollavision");
      const hasLearning = code.toLowerCase().includes("i am learning html") || code.toLowerCase().includes("learning html");
      
      return {
        passed: hasH1 && hasParagraph && hasWelcome && hasLearning,
        feedback: {
          hasH1: hasH1 ? "✓ Heading found" : "✗ Add an <h1> tag with 'Welcome to MollaVision'",
          hasParagraph: hasParagraph ? "✓ Paragraph found" : "✗ Add a <p> tag with your text",
          hasWelcome: hasWelcome ? "✓ Welcome text found" : "✗ Make sure to include 'Welcome to MollaVision'",
          hasLearning: hasLearning ? "✓ Learning text found" : "✗ Add a paragraph about learning HTML"
        }
      };
    }
  },
  {
    id: "html-elements-exercise",
    lessonId: "html-elements",
    courseId: "html",
    title: "Create Nested Elements",
    question: "Create a structure with a div containing a heading 'My Website' and two paragraphs. The first paragraph should say 'Welcome!' and the second should say 'This is a nested structure.'",
    initialCode: `<body>

</body>`,
    expectedOutput: "My Website",
    difficulty: "beginner",
    type: "html",
    hint: "Use <div>, <h2>, and <p> tags. Make sure the tags are properly nested.",
    explanation: "This exercise teaches you about nesting elements and proper tag structure.",
    validator: (code) => {
      const hasDiv = code.includes("<div>") && code.includes("</div>");
      const hasH2 = code.includes("<h2>") && code.includes("</h2>");
      const hasMultipleParagraphs = (code.match(/<p>/g) || []).length >= 2;
      const hasMyWebsite = code.includes("My Website");
      const hasWelcome = code.includes("Welcome!");
      
      return {
        passed: hasDiv && hasH2 && hasMultipleParagraphs && hasMyWebsite && hasWelcome,
        feedback: {
          hasDiv: hasDiv ? "✓ Div found" : "✗ Use a <div> container",
          hasH2: hasH2 ? "✓ Heading found" : "✗ Add an <h2> tag",
          hasMultipleParagraphs: hasMultipleParagraphs ? "✓ Multiple paragraphs found" : "✗ Add at least 2 <p> tags",
          hasMyWebsite: hasMyWebsite ? "✓ 'My Website' text found" : "✗ Add 'My Website' to your heading",
          hasWelcome: hasWelcome ? "✓ 'Welcome!' text found" : "✗ Add 'Welcome!' to your paragraph"
        }
      };
    }
  }
];

export const getExerciseById = (id) => {
  return exercises.find(exercise => exercise.id === id);
};

export const getExerciseByLessonId = (lessonId) => {
  return exercises.find(exercise => exercise.lessonId === lessonId);
};
