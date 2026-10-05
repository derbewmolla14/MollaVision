import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/common/Button';
import { chapterAPI, courseAPI, lessonAdminAPI } from '../services/api';

const blankCourse = { title: '', description: '', shortDescription: '', category: 'programming', level: 'Beginner', thumbnail: '', isPremium: false, isPublished: false };
const blankLesson = { title: '', description: '', module: 'General', order: 1, content: '', isPreview: false, isPremium: false, isPublished: true, duration: 0 };

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [courseForm, setCourseForm] = useState(blankCourse);
  const [chapterTitle, setChapterTitle] = useState('');
  const [lessonForm, setLessonForm] = useState(blankLesson);
  const [editingCourse, setEditingCourse] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    try { const { data } = await courseAPI.list(); setCourses(data.courses); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load courses.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const selectCourse = async (course) => {
    setSelected(course); setCourseForm({ ...blankCourse, ...course }); setEditingCourse(false); setError('');
    try { const [{ data: chapterData }, { data: lessonData }] = await Promise.all([chapterAPI.list(course._id), lessonAdminAPI.list(course.slug)]); setChapters(chapterData.chapters); setLessons(lessonData.lessons); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load chapters.'); }
  };
  const saveCourse = async (event) => {
    event.preventDefault(); setError('');
    try {
      const { data } = editingCourse ? await courseAPI.update(selected._id, courseForm) : await courseAPI.create(courseForm);
      setMessage(editingCourse ? 'Course updated.' : 'Course created.'); setEditingCourse(false); await load(); selectCourse(data.course);
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save course.'); }
  };
  const saveChapter = async (event) => {
    event.preventDefault(); if (!chapterTitle.trim()) return;
    try { const { data } = await chapterAPI.create(selected._id, { title: chapterTitle, order: chapters.length + 1 }); setChapters([...chapters, data.chapter]); setChapterTitle(''); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Unable to create chapter.'); }
  };
  const saveLesson = async (event, chapter) => {
    event.preventDefault(); setError('');
    const payload = { ...lessonForm, order: Number(lessonForm.order), content: lessonForm.content ? [{ type: 'text', value: lessonForm.content }] : [] , chapterId: chapter._id };
    try {
      if (editingLesson) await lessonAdminAPI.update(editingLesson._id, payload); else await lessonAdminAPI.create(selected._id, payload);
      const [{ data: chapterData }, { data: lessonData }] = await Promise.all([chapterAPI.list(selected._id), lessonAdminAPI.list(selected.slug)]); setChapters(chapterData.chapters); setLessons(lessonData.lessons); setEditingLesson(null); setLessonForm(blankLesson); setMessage('Lesson saved.');
    } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to save lesson.'); }
  };
  const remove = async (kind, item) => {
    if (!window.confirm(`Remove this ${kind}?`)) return;
    try { if (kind === 'course') await courseAPI.remove(item._id); if (kind === 'chapter') await chapterAPI.remove(item._id); if (kind === 'lesson') await lessonAdminAPI.remove(item._id); setMessage(`${kind[0].toUpperCase()}${kind.slice(1)} removed.`); if (kind === 'course') { setSelected(null); load(); } else { const [{ data: chapterData }, { data: lessonData }] = await Promise.all([chapterAPI.list(selected._id), lessonAdminAPI.list(selected.slug)]); setChapters(chapterData.chapters); setLessons(lessonData.lessons); } }
    catch (requestError) { setError(requestError.response?.data?.message || `Unable to remove ${kind}.`); }
  };

  return <div className="min-h-screen bg-gray-50"><div className="container-custom py-10"><Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><FiArrowLeft /> Admin dashboard</Link><div className="flex flex-col gap-8 lg:flex-row"><AdminSidebar /><main className="min-w-0 flex-1"><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-bold text-slate-900">Courses, chapters and lessons</h1><p className="mt-1 text-slate-600">Manage the learning catalog without deleting existing records.</p></div><Button onClick={() => { setSelected(null); setCourseForm(blankCourse); setEditingCourse(false); }}> <FiPlus /> New course</Button></div>{error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{message && <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}<div className="grid gap-6 xl:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]"><section className="space-y-3">{loading ? <p>Loading courses...</p> : courses.map((course) => <button type="button" key={course._id} onClick={() => selectCourse(course)} className={`w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 ${selected?._id === course._id ? 'ring-2 ring-blue-500' : ''}`}><span className="flex items-center justify-between gap-3"><strong className="text-slate-900">{course.title}</strong><span className={`text-xs font-semibold ${course.isPublished ? 'text-green-600' : 'text-slate-400'}`}>{course.isPublished ? 'Published' : 'Draft'}</span></span><span className="mt-1 block text-sm text-slate-500">{course.level} · {course.isPremium ? 'Premium' : 'Free'}</span></button>)}</section>{selected ? <section className="space-y-6"><div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-bold text-slate-900">{selected.title}</h2><p className="mt-1 text-sm text-slate-500">{selected.description}</p></div><div className="flex gap-2"><button type="button" title="Edit course" onClick={() => setEditingCourse(true)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"><FiEdit2 /></button><button type="button" title="Unpublish course" onClick={() => remove('course', selected)} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><FiTrash2 /></button></div></div>{editingCourse && <form onSubmit={saveCourse} className="mt-5 grid gap-3 border-t pt-5 md:grid-cols-2">{[['title','Title'],['shortDescription','Short description'],['thumbnail','Thumbnail URL'],['category','Category']].map(([name,label]) => <label key={name} className="text-sm font-medium text-slate-700">{label}<input name={name} value={courseForm[name] || ''} onChange={(event) => setCourseForm({ ...courseForm, [name]: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" required={name === 'title'} /></label>)}<label className="text-sm font-medium text-slate-700">Description<textarea value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 md:col-span-2" required /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={courseForm.isPublished} onChange={(event) => setCourseForm({ ...courseForm, isPublished: event.target.checked })} /> Published</label><Button type="submit">Save course</Button></form>}</div><form onSubmit={saveChapter} className="flex gap-2"><input value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} placeholder="New chapter title" className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2" /><Button type="submit"><FiPlus /> Chapter</Button></form>{chapters.map((chapter) => <div key={chapter._id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><div className="flex items-center justify-between gap-3"><h3 className="font-bold text-slate-900">{chapter.order}. {chapter.title}</h3><button type="button" title="Delete chapter" onClick={() => remove('chapter', chapter)} className="p-2 text-red-600"><FiTrash2 /></button></div><form onSubmit={(event) => saveLesson(event, chapter)} className="mt-4 grid gap-2 border-t pt-4 md:grid-cols-[1fr_100px_auto]"><input placeholder="Lesson title" value={lessonForm.chapterId === chapter._id ? lessonForm.title : ''} onChange={(event) => setLessonForm({ ...lessonForm, chapterId: chapter._id, title: event.target.value })} required className="rounded-lg border border-slate-300 px-3 py-2" /><input type="number" min="1" placeholder="Order" value={lessonForm.chapterId === chapter._id ? lessonForm.order : 1} onChange={(event) => setLessonForm({ ...lessonForm, chapterId: chapter._id, order: event.target.value })} className="rounded-lg border border-slate-300 px-3 py-2" /><Button type="submit"><FiPlus /> Lesson</Button></form><p className="mt-3 text-sm text-slate-500">Lessons are linked to this chapter through the persisted chapter ID.</p></div>)}</section> : <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Select a course or create one to manage its content.</section>}</div></main></div></div></div>;
};

export default AdminCourses;