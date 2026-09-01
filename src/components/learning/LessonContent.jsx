import CodeExample from './CodeExample';
import CodePlayground from './CodePlayground';
import Exercise from './Exercise';
import { LessonNote, LessonTip, LessonWarning, LessonHeading, LessonText, LessonList } from './ContentComponents';
import { getExerciseById } from '../../data/exercises';

const LessonContent = ({ content, onExerciseComplete }) => {
  return (
    <div className="prose prose-sm max-w-none">
      {content.map((block, idx) => {
        switch (block.type) {
          case "heading":
            return (
              <LessonHeading key={idx} level={block.level}>
                {block.text}
              </LessonHeading>
            );

          case "text":
            return (
              <LessonText key={idx}>
                {block.text}
              </LessonText>
            );

          case "code":
            return (
              <CodeExample
                key={idx}
                language={block.language}
                code={block.code}
              />
            );

          case "list":
            return (
              <LessonList key={idx} items={block.items} />
            );

          case "note":
            return (
              <LessonNote key={idx}>
                {block.text}
              </LessonNote>
            );

          case "tip":
            return (
              <LessonTip key={idx}>
                {block.text}
              </LessonTip>
            );

          case "warning":
            return (
              <LessonWarning key={idx}>
                {block.text}
              </LessonWarning>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default LessonContent;
