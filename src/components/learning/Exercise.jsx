import { useState } from 'react';
import { FiPlay, FiRotateCcw, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const Exercise = ({ exercise, onComplete }) => {
  const [code, setCode] = useState(exercise.initialCode);
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleRun = () => {
    setResult(null);
  };

  const handleCheckAnswer = () => {
    const validation = exercise.validator(code);
    setResult(validation);

    if (validation.passed && onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setCode(exercise.initialCode);
    setResult(null);
    setShowHint(false);
    setShowExplanation(false);
  };

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/60 shadow-[0_10px_30px_rgba(245,158,11,0.08)]">
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-yellow-500 px-5 py-4 text-white">
        <h3 className="text-base font-bold sm:text-lg">💡 Exercise: {exercise.title}</h3>
        <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em]">Practice</span>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <div className="rounded-xl border border-amber-200 bg-white p-4">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.12em] text-amber-700">Your task</p>
          <p className="text-sm leading-7 text-slate-700 sm:text-base">{exercise.question}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Write your code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="h-64 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-800 outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
            spellCheck="false"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleRun}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <FiPlay size={16} />
            Run
          </button>
          <button
            onClick={handleCheckAnswer}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            <FiCheck size={16} />
            Check Answer
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-300"
          >
            <FiRotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={() => setShowHint(!showHint)}
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
          >
            💡 Hint
            {showHint ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
          </button>
        </div>

        {showHint && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-800">
            <span className="font-semibold">Hint:</span> {exercise.hint}
          </div>
        )}

        {result && (
          <div className={`rounded-xl border p-4 ${result.passed ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <div className="mb-3 flex items-center gap-3">
              {result.passed ? (
                <>
                  <FiCheck className="text-emerald-600" size={22} />
                  <p className="text-base font-bold text-emerald-700">Correct! Great job.</p>
                </>
              ) : (
                <>
                  <FiX className="text-rose-600" size={22} />
                  <p className="text-base font-bold text-rose-700">Not quite right yet.</p>
                </>
              )}
            </div>

            <div className="space-y-2 text-sm leading-6">
              {Object.entries(result.feedback).map(([key, message]) => (
                <div key={key} className={message.startsWith('✓') ? 'text-emerald-700' : 'text-rose-700'}>
                  {message}
                </div>
              ))}
            </div>
          </div>
        )}

        {result?.passed && (
          <div>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-semibold text-blue-700 hover:text-blue-800"
            >
              📚 View Explanation
              {showExplanation ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            </button>
          </div>
        )}

        {showExplanation && (
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-slate-700">
            {exercise.explanation}
          </div>
        )}

        <div className="pt-2">
          <span className="inline-flex rounded-full bg-slate-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
            Difficulty: {exercise.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Exercise;
