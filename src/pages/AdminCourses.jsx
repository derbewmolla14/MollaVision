import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiEye, FiPlus, FiTrash2 } from 'react-icons/fi';
import AdminSidebar from '../components/admin/AdminSidebar';
import Button from '../components/common/Button';
import { chapterAPI, courseAPI, lessonAdminAPI } from '../services/api';

const blankCourse = { title: '', description: '', shortDescription: '', category: 'programming', level: 'Beginner', thumbnail: '', isPremium: false, isPublished: false };
const blankLesson = { title: '', description: '', videoUrl: '', order: 1, isPreview: true, isPremium: false, isPublished: true };

const getError = (error, fallback) => error.response?.data?.message || fallback;

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [chapterTitle, setChapterTitle] = useState('');
  const [courseForm, setCourseForm] = useState(blankCourse);
  const [lessonForm, setLessonForm] = useState(blankLesson);
  const [editingCourse, setEditingCourse] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data } = await courseAPI.list();
      setCourses(data.courses);
    } catch (requestError) {
      setError(getError(requestError, 'Unable to load courses.'));
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (course) => {
    try {
      const [{ data: lessonData }, { data: chapterData }] = await Promise.all([lessonAdminAPI.list(course.slug), chapterAPI.list(course._id)]);
      setChapters(chapterData.chapters);
      setLessons(lessonData.lessons.sort((a, b) => a.order - b.order));
    } catch (requestError) {
      setError(getError(requestError, 'Unable to load lessons.'));
    }
  };

  const saveChapter = async (event) => {
    event.preventDefault();
    if (!selected || !chapterTitle.trim()) return;
    try {
      const { data } = await chapterAPI.create(selected._id, { title: chapterTitle.trim(), order: chapters.length + 1 });
      setChapters([...chapters, data.chapter]);
      setChapterTitle('');
      setMessage('Chapter added.');
    } catch (requestError) {
      setError(getError(requestError, 'Unable to add chapter.'));
    }
  };

  const removeChapter = async (chapter) => {
    if (!window.confirm(`Delete "${chapter.title}"?`)) return;
    try {
      await chapterAPI.remove(chapter._id);
      setChapters(chapters.filter((item) => item._id !== chapter._id));
      setMessage('Chapter deleted.');
    } catch (requestError) {
      setError(getError(requestError, 'Unable to delete chapter.'));
    }
  };

  useEffect(() => { loadCourses(); }, []);

  const selectCourse = async (course) => {
    setSelected(course);
    setCourseForm({ ...blankCourse, ...course });
    setEditingCourse(false);
    setEditingLesson(null);
    setLessonForm({ ...blankLesson, order: (course.totalLessons || 0) + 1 });
    setError('');
    await loadLessons(course);
  };

  const saveCourse = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { data } = selected
        ? await courseAPI.update(selected._id, courseForm)
        : await courseAPI.create(courseForm);
      setMessage(selected ? 'Course updated.' : 'Course created.');
      setSelected(data.course);
      setCourseForm({ ...blankCourse, ...data.course });
      setEditingCourse(false);
      await loadCourses();
      await loadLessons(data.course);
    } catch (requestError) {
      setError(getError(requestError, 'Unable to save course.'));
    } finally {
      setSaving(false);
    }
  };

  const saveLesson = async (event) => {
    event.preventDefault();
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      const payload = { ...lessonForm, order: Number(lessonForm.order) };
      if (editingLesson) await lessonAdminAPI.update(editingLesson._id, payload);
      else await lessonAdminAPI.create(selected._id, payload);
      setMessage(editingLesson ? 'Lesson updated.' : 'Lesson added.');
      setEditingLesson(null);
      setLessonForm({ ...blankLesson, order: lessons.length + 1 });
      await loadCourses();
      await loadLessons(selected);
    } catch (requestError) {
      setError(getError(requestError, 'Unable to save lesson.'));
    } finally {
      setSaving(false);
    }
  };

  const editLesson = (lesson) => {
    setEditingLesson(lesson);
    setLessonForm({ ...blankLesson, ...lesson });
    setError('');
  };

  const removeLesson = async (lesson) => {
    if (!window.confirm(`Delete "${lesson.title}"? This cannot be undone.`)) return;
    try {
      await lessonAdminAPI.remove(lesson._id);
      setMessage('Lesson deleted.');
      await loadCourses();
      await loadLessons(selected);
    } catch (requestError) {
      setError(getError(requestError, 'Unable to delete lesson.'));
    }
  };

  const startNewCourse = () => {
    setSelected(null);
    setLessons([]);
    setCourseForm(blankCourse);
    setEditingCourse(true);
    setMessage('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-10">
        <Link to="/admin" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"><FiArrowLeft /> Admin dashboard</Link>
        <div className="flex flex-col gap-8 lg:flex-row">
          <AdminSidebar />
          <main className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div><h1 className="text-3xl font-bold text-slate-900">Courses and lessons</h1><p className="mt-1 text-slate-600">Create and update catalog content without editing source code.</p></div>
              <Button onClick={startNewCourse}><FiPlus /> New course</Button>
            </div>
            {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
            {message && <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
            <div className="grid gap-6 xl:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.5fr)]">
              <section className="space-y-3">
                {loading ? <p>Loading courses...</p> : courses.map((course) => <button type="button" key={course._id} onClick={() => selectCourse(course)} className={`w-full rounded-xl bg-white p-4 text-left shadow-sm ring-1 ring-slate-200 ${selected?._id === course._id ? 'ring-2 ring-blue-500' : ''}`}><span className="flex items-center justify-between gap-3"><strong>{course.title}</strong><span className={course.isPublished ? 'text-xs text-green-600' : 'text-xs text-slate-400'}>{course.isPublished ? 'Published' : 'Draft'}</span></span><span className="mt-1 block text-sm text-slate-500">{course.totalLessons || 0} lessons · {course.level}</span></button>)}
              </section>
              {(selected || editingCourse) && <section className="space-y-6">
                <form onSubmit={saveCourse} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{selected ? 'Course details' : 'New course'}</h2>{selected && !editingCourse && <button type="button" onClick={() => setEditingCourse(true)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit course"><FiEdit2 /></button>}</div>
                  {(editingCourse || !selected) ? <div className="grid gap-3 md:grid-cols-2">
                    {['title', 'category', 'thumbnail'].map((name) => <label key={name} className="text-sm font-medium text-slate-700">{name === 'title' ? 'Title' : name === 'thumbnail' ? 'Thumbnail URL' : 'Category'}<input value={courseForm[name] || ''} onChange={(event) => setCourseForm({ ...courseForm, [name]: event.target.value })} required={name === 'title'} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" /></label>)}
                    <label className="text-sm font-medium text-slate-700">Difficulty<select value={courseForm.level} onChange={(event) => setCourseForm({ ...courseForm, level: event.target.value })} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">{['Beginner', 'Intermediate', 'Advanced'].map((level) => <option key={level}>{level}</option>)}</select></label>
                    <label className="text-sm font-medium text-slate-700 md:col-span-2">Description<textarea value={courseForm.description} onChange={(event) => setCourseForm({ ...courseForm, description: event.target.value })} required className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" rows="3" /></label>
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={courseForm.isPublished} onChange={(event) => setCourseForm({ ...courseForm, isPublished: event.target.checked })} /> Published</label>
                    <div className="flex gap-2"><Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save course'}</Button>{selected && <Button type="button" variant="secondary" onClick={() => setEditingCourse(false)}>Cancel</Button>}</div>
                  </div> : <p className="text-slate-600">{selected.description}</p>}
                </form>
                {selected && <><form onSubmit={saveChapter} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h2 className="mb-4 text-xl font-bold">Chapters</h2><div className="flex gap-2"><input value={chapterTitle} onChange={(event) => setChapterTitle(event.target.value)} placeholder="Chapter title" className="min-w-0 flex-1 rounded-lg border px-3 py-2" /><Button type="submit"><FiPlus /> Add chapter</Button></div><div className="mt-3 space-y-2">{chapters.map((chapter) => <div key={chapter._id} className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"><span>#{chapter.order} {chapter.title}</span><button type="button" onClick={() => removeChapter(chapter)} className="text-red-600" title="Delete chapter"><FiTrash2 /></button></div>)}</div></form><form onSubmit={saveLesson} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h2 className="mb-4 text-xl font-bold">{editingLesson ? 'Edit lesson' : 'Add lesson'}</h2><div className="grid gap-3 md:grid-cols-2"><label className="text-sm font-medium">Title<input value={lessonForm.title} onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })} required className="mt-1 w-full rounded-lg border px-3 py-2" /></label><label className="text-sm font-medium">Order<input type="number" min="1" value={lessonForm.order} onChange={(event) => setLessonForm({ ...lessonForm, order: event.target.value })} required className="mt-1 w-full rounded-lg border px-3 py-2" /></label><label className="text-sm font-medium md:col-span-2">YouTube URL<input type="url" value={lessonForm.videoUrl} onChange={(event) => setLessonForm({ ...lessonForm, videoUrl: event.target.value })} placeholder="https://www.youtube.com/watch?v=..." className="mt-1 w-full rounded-lg border px-3 py-2" /></label><label className="text-sm font-medium md:col-span-2">Description<textarea value={lessonForm.description} onChange={(event) => setLessonForm({ ...lessonForm, description: event.target.value })} className="mt-1 w-full rounded-lg border px-3 py-2" rows="2" /></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lessonForm.isPublished} onChange={(event) => setLessonForm({ ...lessonForm, isPublished: event.target.checked })} /> Published</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lessonForm.isPreview} onChange={(event) => setLessonForm({ ...lessonForm, isPreview: event.target.checked })} /> Preview lesson</label></div><div className="mt-4 flex gap-2"><Button type="submit" disabled={saving}>{saving ? 'Saving...' : editingLesson ? 'Save lesson' : 'Add lesson'}</Button>{editingLesson && <Button type="button" variant="secondary" onClick={() => { setEditingLesson(null); setLessonForm({ ...blankLesson, order: lessons.length + 1 }); }}>Cancel</Button>}</div></form><div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"><h2 className="mb-4 text-xl font-bold">Lessons</h2>{!lessons.length ? <p className="text-slate-600">No lessons yet.</p> : <div className="space-y-3">{lessons.map((lesson) => <div key={lesson._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"><div><span className="mr-2 text-sm font-semibold text-blue-600">#{lesson.order}</span><strong>{lesson.title}</strong><p className="text-sm text-slate-500">{lesson.description || 'No description'}{lesson.videoId ? ' · YouTube video ready' : ''}</p></div><div className="flex gap-2"><Link to={`/courses/${selected.slug}/${lesson._id}`} target="_blank" className="rounded-lg p-2 text-slate-600 hover:bg-slate-100" title="Preview lesson"><FiEye /></Link><button type="button" onClick={() => editLesson(lesson)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50" title="Edit lesson"><FiEdit2 /></button><button type="button" onClick={() => removeLesson(lesson)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" title="Delete lesson"><FiTrash2 /></button></div></div>)}</div>}</div></>}
              </section>}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
