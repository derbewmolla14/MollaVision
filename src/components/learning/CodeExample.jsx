import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

const CodeExample = ({ language = 'html', code = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="my-7 overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-[0_14px_32px_rgba(15,23,42,0.12)]">
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3">
        <span className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-200">
          {language}
        </span>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
          title="Copy code"
          aria-label="Copy code example"
        >
          {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="overflow-x-auto p-4 sm:p-5">
        <pre className="min-w-max text-sm leading-7 text-slate-100">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeExample;
