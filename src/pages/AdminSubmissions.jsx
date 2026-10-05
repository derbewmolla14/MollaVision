import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/common/Button';
import { adminAPI } from '../services/api';

const AdminSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { adminAPI.submissions().then(({ data }) => setSubmissions(data.submissions)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load submissions.')); }, []);
  const grade = async (event) => { event.preventDefault(); try { await adminAPI.gradeSubmission(selected._id, { score: Number(score), totalMarks: selected.totalMarks, feedback }); setSubmissions(submissions.map((item) => item._id === selected._id ? { ...item, score: Number(score), feedback, status: 'graded' } : item)); setSelected(null); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to grade submission.'); } };
  return <div className="min-h-screen bg-gray-50"><div className="container-custom py-10"><Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><FiArrowLeft /> Admin dashboard</Link><div className="flex flex-col gap-8 lg:flex-row"><AdminSidebar /><main className="min-w-0 flex-1"><h1 className="text-3xl font-bold text-slate-900">Submissions</h1><p className="mt-1 text-slate-600">Review scores and provide feedback.</p>{error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}<div className="mt-6 space-y-3">{submissions.map((submission) => <div key={submission._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div><p className="font-semibold text-slate-900">{submission.userId?.name || 'Student'}</p><p className="text-sm text-slate-500">{submission.practiceId?.title || 'Practice'} · {new Date(submission.submittedAt).toLocaleString()}</p></div><div className="flex items-center gap-4"><span className="font-bold text-slate-900">{submission.score}/{submission.totalMarks}</span><Button className="px-3 py-2" onClick={() => { setSelected(submission); setScore(submission.score); setFeedback(submission.feedback || ''); }}>Grade</Button></div></div>)}</div>{selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><form onSubmit={grade} className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="text-xl font-bold text-slate-900">Grade submission</h2><label className="mt-5 block text-sm font-medium text-slate-700">Score<input type="number" min="0" max={selected.totalMarks} value={score} onChange={(event) => setScore(event.target.value)} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="mt-4 block text-sm font-medium text-slate-700">Feedback<textarea value={feedback} onChange={(event) => setFeedback(event.target.value)} rows="4" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setSelected(null)} className="font-semibold text-slate-600">Cancel</button><Button type="submit">Save grade</Button></div></form></div>}</main></div></div></div>;
};

export default AdminSubmissions;