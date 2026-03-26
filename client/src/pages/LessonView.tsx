// client/src/pages/LessonView.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';

export default function LessonView() {
  const { courseId, moduleId, lessonId } = useParams();
  const { theme } = useTheme();
  
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const requestInProgress = useRef(false);

  useEffect(() => {
    const fetchAndGenerateLesson = async () => {
      if (requestInProgress.current) return;
      requestInProgress.current = true;

      try {
        setLoading(true);
        setError('');

        const courseRes = await apiClient.get(`/api/courses/${courseId}`);
        const course = courseRes.data;
        const currentModule = course.modules.find((m: any) => m._id.toString() === moduleId);

        if (!currentModule) throw new Error("Module not found.");

        const lessonRes = await apiClient.post('/api/courses/generate-lesson', {
          courseTitle: course.title,
          moduleTitle: currentModule.title,
          lessonId: lessonId,
        });

        setLesson(lessonRes.data);
      } catch (err: any) {
        console.error("Lesson Error:", err);
        setError(err.response?.data?.message || err.message || 'Failed to load lesson.');
        requestInProgress.current = false;
      } finally {
        setLoading(false);
      }
    };

    if (courseId && moduleId && lessonId) fetchAndGenerateLesson();
  }, [courseId, moduleId, lessonId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className={`font-medium animate-pulse ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          AI is writing your content...
        </p>
      </div>
    );
  }

  if (error || !lesson) return (
    <div className={`max-w-xl mx-auto mt-20 p-10 rounded-3xl border text-center ${theme === 'dark' ? 'bg-gray-900 border-red-900' : 'bg-white border-red-100'}`}>
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 font-bold text-xl mb-6">{error || 'Lesson not found'}</p>
      <Link to={`/course/${courseId}`} className="text-blue-600 hover:underline flex items-center justify-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Return to Curriculum
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto pb-20 print:p-0 print:m-0">
      <Link to={`/course/${courseId}`} className={`print:hidden flex items-center gap-2 mb-6 font-medium ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Curriculum
      </Link>

      <div className={`p-8 md:p-12 rounded-3xl shadow-sm border print:border-none print:shadow-none transition-colors ${theme === 'dark' ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-10">
          <h1 className="text-4xl font-black leading-tight flex-1">{lesson.title}</h1>
          
          <div className="flex gap-3 print:hidden">
            <LessonPDFExporter />
          </div>
        </div>

        {lesson.objectives?.length > 0 && (
          <div className={`rounded-2xl p-6 mb-10 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3 opacity-70">Objectives</h3>
            <ul className="list-disc pl-5 space-y-2">
              {lesson.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>)}
            </ul>
          </div>
        )}

        {/* Text color safely falls back to parent container's standard text colors */}
        <div className="prose-container">
           <LessonRenderer content={lesson.content} />
        </div>
      </div>
    </div>
  );
}