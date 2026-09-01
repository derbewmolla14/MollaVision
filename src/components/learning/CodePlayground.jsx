import { useState } from 'react';
import { FiPlay, FiRotateCcw, FiCopy, FiCheck } from 'react-icons/fi';
import Button from '../common/Button';

const CodePlayground = ({ initialCode = "", language = "html" }) => {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    if (language === "html" || language === "css" || language === "html-css") {
      setOutput(code);
    } else {
      alert("JavaScript execution coming soon!");
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-gray-300 bg-white">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 font-semibold">
        Interactive {language.toUpperCase()} Playground
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-300">
        {/* Code Editor */}
        <div className="p-4">
          <div className="mb-3">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Your Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              spellCheck="false"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              <FiPlay size={16} />
              Run
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors font-medium text-sm"
            >
              <FiRotateCcw size={16} />
              Reset
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
            >
              {copied ? (
                <>
                  <FiCheck size={16} />
                  Copied
                </>
              ) : (
                <>
                  <FiCopy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="p-4 bg-gray-50">
          <div className="mb-3">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Live Preview
            </label>
            <div className="w-full h-64 bg-white border border-gray-300 rounded-lg overflow-hidden">
              {output ? (
                <iframe
                  srcDoc={output}
                  title="HTML Output"
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <p className="text-center">
                    <div className="text-3xl mb-2">👀</div>
                    Click "Run" to see preview
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePlayground;
