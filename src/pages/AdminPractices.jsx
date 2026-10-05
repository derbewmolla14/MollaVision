import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Button from '../components/common/Button';
import { courseAPI, practiceAPI } from '../services/api';
import AdminSidebar from '../components/admin/AdminSidebar';

const emptyForm = { title: '', description: '', courseId: '', chapter: '', difficulty: 'Beginner', marks: 1, isPublished: false, prompt: '', type: 'multiple-choice', options: '', correctAnswer: '', questionMarks: 1 };

const AdminPractices = () => {
  const [practices, setPractices] = useState([]);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [practiceResponse, courseResponse] = await Promise.all([practiceAPI.list(), courseAPI.list()]);
      setPractices(practiceResponse.data.practices);
      setCourses(courseResponse.data.courses);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load practice management data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value });

  const editPractice = (practice) => {
    const question = practice.questions[0] || {};
    setEditingId(practice._id);
    setForm({ title: practice.title, description: practice.description, courseId: practice.courseId?._id || practice.courseId, chapter: practice.chapter, difficulty: practice.difficulty, marks: practice.marks, isPublished: practice.isPublished, prompt: question.prompt || '', type: question.type || 'short-answer', options: question.options?.map((option) => option.text).join('\n') || '', correctAnswer: question.correctAnswer || '', questionMarks: question.marks || 1 });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savePractice = async (event) => {
    event.preventDefault();
    setSaving(true); setError(''); setMessage('');
    const payload = { title: form.title, description: form.description, courseId: form.courseId, chapter: form.chapter, difficulty: form.difficulty, marks: Number(form.marks), isPublished: form.isPublished, questions: [{ prompt: form.prompt, type: form.type, options: form.type === 'multiple-choice' ? form.options.split('\n').filter(Boolean).map((text) => ({ text })) : [], correctAnswer: form.correctAnswer, marks: Number(form.questionMarks) }] };
    try {
      if (editingId) await practiceAPI.update(editingId, payload); else await practiceAPI.create(payload);
      setMessage(editingId ? 'Practice updated successfully.' : 'Practice created successfully.');
      setEditingId(null); setForm(emptyForm); await load();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save practice.');
    } finally { setSaving(false); }
  };

  const removePractice = async (practiceId) => {
    if (!window.confirm('Delete this practice and its submissions?')) return;
    try { await practiceAPI.remove(practiceId); setPractices(practices.filter((practice) => practice._id !== practiceId)); setMessage('Practice deleted.'); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to delete practice.'); }
  };

  return (
    <div className="min-h-screen bg-gray-50"><div className="container-custom py-12">
      <Link to="/admin" className="mb-6 inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"><FiArrowLeft size={18} /> Back to Admin</Link>
      <div className="flex flex-col gap-8 lg:flex-row"><AdminSidebar /><main className="min-w-0 flex-1">
      <div className="mb-8"><p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Content management</p><h1 className="mt-1 text-4xl font-bold text-slate-900">Practice exercises</h1><p className="mt-2 text-slate-600">Create questions for a course chapter and publish them for students.</p></div>
      {error && <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p className="mb-5 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
      <form onSubmit={savePractice} className="mb-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"><h2 className="mb-5 text-xl font-bold text-slate-900">{editingId ? 'Edit practice' : 'Create practice'}</h2>
        <div className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Title<input name="title" value={form.title} onChange={updateField} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="text-sm font-medium text-slate-700">Course<select name="courseId" value={form.courseId} onChange={updateField} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="">Select course</option>{courses.map((course) => <option key={course._id} value={course._id}>{course.title}</option>)}</select></label><label className="text-sm font-medium text-slate-700">Chapter<input name="chapter" value={form.chapter} onChange={updateField} required placeholder="Module 1" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="text-sm font-medium text-slate-700">Difficulty<select name="difficulty" value={form.difficulty} onChange={updateField} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></label></div>
        <label className="mt-4 block text-sm font-medium text-slate-700">Instructions<textarea name="description" value={form.description} onChange={updateField} required rows="3" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>
        <div className="mt-6 border-t border-slate-100 pt-5"><h3 className="font-semibold text-slate-900">Question 1</h3><label className="mt-3 block text-sm font-medium text-slate-700">Question<textarea name="prompt" value={form.prompt} onChange={updateField} required rows="2" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><div className="mt-4 grid gap-4 md:grid-cols-3"><label className="text-sm font-medium text-slate-700">Type<select name="type" value={form.type} onChange={updateField} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"><option value="multiple-choice">Multiple choice</option><option value="short-answer">Short answer</option><option value="true-false">True / False</option></select></label><label className="text-sm font-medium text-slate-700">Correct answer<input name="correctAnswer" value={form.correctAnswer} onChange={updateField} required className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label><label className="text-sm font-medium text-slate-700">Question marks<input name="questionMarks" type="number" min="1" value={form.questionMarks} onChange={updateField} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label></div>{form.type === 'multiple-choice' && <label className="mt-4 block text-sm font-medium text-slate-700">Options <span className="font-normal text-slate-500">(one per line)</span><textarea name="options" value={form.options} onChange={updateField} required rows="4" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>}</div>
        <div className="mt-5 flex flex-wrap items-center gap-4"><label className="flex items-center gap-2 text-sm text-slate-700"><input name="isPublished" type="checkbox" checked={form.isPublished} onChange={updateField} className="h-4 w-4 rounded text-blue-600" /> Publish immediately</label><Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update Practice' : 'Create Practice'}</Button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="text-sm font-semibold text-slate-600">Cancel</button>}</div>
      </form>
      <section><h2 className="mb-4 text-2xl font-bold text-slate-900">Existing practices</h2>{loading ? <p className="text-slate-600">Loading practices...</p> : <div className="space-y-3">{practices.map((practice) => <div key={practice._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div><h3 className="font-bold text-slate-900">{practice.title}</h3><p className="text-sm text-slate-500">{practice.courseId?.title || 'Course'} · {practice.chapter} · {practice.isPublished ? 'Published' : 'Draft'}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => editPractice(practice)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"><FiEdit2 size={15} /> Edit</button><button type="button" onClick={() => removePractice(practice._id)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"><FiTrash2 size={15} /> Delete</button></div></div>)}</div>}</section>
      </main></div>
    </div></div>
  );
};

export default AdminPractices;