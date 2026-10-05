import { useEffect, useState } from 'react';
import { FiArrowLeft, FiCheckCircle, FiClock, FiPlay } from 'react-icons/fi';
import Button from '../components/common/Button';
import { practiceAPI } from '../services/api';

const Practice = () => {
  const [practices, setPractices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPractices = () => {
    setLoading(true);
    practiceAPI.list()
      .then(({ data }) => setPractices(data.practices))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load practices.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPractices();
  }, []);

  const openPractice = async (practiceId) => {
    setError('');
    try {
      const { data } = await practiceAPI.get(practiceId);
      setSelected(data.practice);
      setSubmission(data.submission);
      setAnswers({});
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to open this practice.');
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const { data } = await practiceAPI.submit(selected._id, Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer })));
      setSubmission(data.submission);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit your answers.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-12">
          <button type="button" onClick={() => setSelected(null)} className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"><FiArrowLeft size={18} /> Back to Practice</button>
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">{selected.chapter}</p><h1 className="mt-1 text-3xl font-bold text-slate-900">{selected.title}</h1></div><span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{selected.difficulty}</span></div>
            <p className="mt-4 text-slate-600">{selected.description}</p>
          </div>
          {error && <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {submission ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200"><FiCheckCircle className="mx-auto text-green-600" size={42} /><h2 className="mt-4 text-2xl font-bold text-slate-900">Practice submitted</h2><p className="mt-2 text-slate-600">You scored <strong>{submission.score}/{submission.totalMarks}</strong> ({submission.percentage}%).</p><p className="mt-1 text-sm text-slate-500">Status: {submission.status}</p><Button className="mt-6" onClick={() => { setSubmission(null); setAnswers({}); }}>Try Again</Button></div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              {selected.questions.map((question, index) => <fieldset key={question._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><legend className="text-lg font-bold text-slate-900">{index + 1}. {question.prompt} <span className="ml-2 text-xs font-medium text-slate-500">{question.marks} mark{question.marks !== 1 ? 's' : ''}</span></legend>{question.type === 'multiple-choice' ? <div className="mt-4 space-y-3">{question.options.map((option) => <label key={option.text} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 p-3 hover:border-blue-300"><input type="radio" name={question._id} value={option.text} checked={answers[question._id] === option.text} onChange={(event) => setAnswers({ ...answers, [question._id]: event.target.value })} required className="h-4 w-4 text-blue-600" /><span className="text-slate-700">{option.text}</span></label>)}</div> : <input value={answers[question._id] || ''} onChange={(event) => setAnswers({ ...answers, [question._id]: event.target.value })} className="mt-4 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" required />}</fieldset>)}
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit Practice'}</Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-16">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Apply what you learn</p>
        <h1 className="mt-2 text-4xl font-bold text-gray-900">Practice</h1>
        <p className="mt-3 max-w-2xl text-lg text-gray-600">Test your understanding with course exercises and see your score immediately.</p>
        {error && <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading ? <p className="mt-10 text-slate-600">Loading practices...</p> : practices.length ? <div className="mt-10 grid gap-6 md:grid-cols-2">{practices.map((practice) => <article key={practice._id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-blue-600">{practice.chapter}</p><h2 className="mt-1 text-xl font-bold text-slate-900">{practice.title}</h2></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{practice.difficulty}</span></div><p className="mt-3 line-clamp-2 text-sm text-slate-600">{practice.description}</p><div className="mt-5 flex items-center justify-between text-sm text-slate-500"><span className="inline-flex items-center gap-2"><FiClock size={15} /> {practice.questions.length} questions</span><Button className="px-4 py-2" onClick={() => openPractice(practice._id)}><FiPlay size={15} /> Start</Button></div></article>)}</div> : <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-bold text-slate-900">No published practices yet</h2><p className="mt-2 text-slate-600">New exercises will appear here when your instructor publishes them.</p></div>}
      </div>
    </div>
  );
};

export default Practice;
