import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';
import useProgress from '../../hooks/useProgress';
import { getLessonsByModule } from '../../data/lessons';

const CourseSidebar = ({ courseId, currentLessonId, courseName }) => {
  const { isComplete } = useProgress(courseId);
  const [expandedModules, setExpandedModules] = useState({});
  const modules = getLessonsByModule(courseId);

  const toggleModule = (moduleName) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  return (
    <aside className="h-full bg-white">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur-sm">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">Course</p>
        <h3 className="mt-2 text-lg font-bold text-slate-900">{courseName}</h3>
        <p className="mt-1 text-xs text-slate-500">{modules.reduce((sum, module) => sum + module.lessons.length, 0)} lessons</p>
      </div>

      <div className="space-y-2 px-3 py-3">
        {modules.map((module) => (
          <div key={module.name} className="rounded-xl border border-slate-100 bg-slate-50/50">
            <button
              onClick={() => toggleModule(module.name)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              <span>{module.name}</span>
              {expandedModules[module.name] ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </button>

            {(expandedModules[module.name] ?? true) && (
              <div className="space-y-1 px-2 pb-2">
                {module.lessons.map((lesson) => {
                  const isCurrentLesson = lesson.id === currentLessonId;
                  const isCompleted = isComplete(courseId, lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      to={`/courses/${courseId}/${lesson.id}`}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all ${
                        isCurrentLesson
                          ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="flex-shrink-0 text-green-600" size={15} />
                      ) : (
                        <span className={`h-2.5 w-2.5 flex-shrink-0 rounded-full border ${isCurrentLesson ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'}`} />
                      )}
                      <span className="flex-grow truncate">{lesson.title}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default CourseSidebar;
