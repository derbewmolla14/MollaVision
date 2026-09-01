const LessonNote = ({ children }) => (
  <div className="my-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
    <p className="text-sm leading-7 text-blue-900">
      <strong className="mb-1 block text-sm font-bold uppercase tracking-[0.12em] text-blue-700">Note</strong>
      {children}
    </p>
  </div>
);

const LessonTip = ({ children }) => (
  <div className="my-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
    <p className="text-sm leading-7 text-emerald-900">
      <strong className="mb-1 block text-sm font-bold uppercase tracking-[0.12em] text-emerald-700">Tip</strong>
      {children}
    </p>
  </div>
);

const LessonWarning = ({ children }) => (
  <div className="my-6 rounded-xl border border-rose-200 bg-rose-50 p-4">
    <p className="text-sm leading-7 text-rose-900">
      <strong className="mb-1 block text-sm font-bold uppercase tracking-[0.12em] text-rose-700">Warning</strong>
      {children}
    </p>
  </div>
);

const LessonHeading = ({ level = 2, children }) => {
  const headingClass = {
    1: 'mt-8 mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl',
    2: 'mt-8 mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl',
    3: 'mt-6 mb-2 text-xl font-bold text-slate-900 sm:text-2xl',
  }[level] || 'mt-6 mb-2 text-xl font-bold text-slate-900';

  const HeadingTag = `h${level}`;
  return <HeadingTag className={headingClass}>{children}</HeadingTag>;
};

const LessonText = ({ children }) => (
  <p className="mb-5 text-base leading-8 text-slate-700">{children}</p>
);

const LessonList = ({ items }) => (
  <ul className="my-5 ml-1 list-none space-y-3">
    {items.map((item, idx) => (
      <li key={idx} className="flex gap-3 text-base leading-7 text-slate-700">
        <span className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export { LessonNote, LessonTip, LessonWarning, LessonHeading, LessonText, LessonList };
