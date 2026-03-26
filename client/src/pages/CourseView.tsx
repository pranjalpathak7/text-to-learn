// client/src/pages/CourseView.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../utils/api';
import { useTheme } from '../context/ThemeContext';
import { Loader2, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';

export default function CourseView() {
  const { courseId } = useParams();
  const { theme } = useTheme();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Explicit state check - bypasses Tailwind's compiler quirks entirely
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiClient.get(`/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className={`font-medium animate-pulse ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Loading curriculum...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={`max-w-xl mx-auto mt-20 p-10 rounded-3xl border text-center ${isDark ? 'bg-gray-900 border-red-900' : 'bg-white border-red-100'}`}>
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 font-bold text-xl mb-6">{error || 'Course not found'}</p>
        <Link to="/" className={`font-bold hover:underline ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      {/* Course Header Card */}
      <div className={`p-8 md:p-10 rounded-3xl shadow-sm border mb-12 transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <h1 className={`text-3xl md:text-4xl font-black mb-4 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {course.title}
        </h1>
        <p className={`text-lg mb-8 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {course.description}
        </p>
        <div className="flex flex-wrap gap-3">
          {course.tags?.map((tag: string) => (
            <span key={tag} className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Curriculum Heading */}
      <h2 className={`text-2xl font-black mb-6 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Curriculum
      </h2>

      {/* Modules List */}
      <div className="space-y-6">
        {course.modules?.map((module: any) => (
          <div key={module._id} className={`rounded-2xl shadow-sm border overflow-hidden transition-colors ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            
            {/* Module Header */}
            <div className={`p-5 border-b ${isDark ? 'bg-gray-900/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {module.title}
              </h3>
            </div>
            
            {/* Lessons List */}
            <div className={`divide-y ${isDark ? 'divide-gray-700/50' : 'divide-gray-100'}`}>
              {module.lessons?.map((lesson: any) => (
                <div key={lesson._id} className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                  
                  <div className={`flex items-start sm:items-center gap-3 font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <BookOpen className={`w-5 h-5 shrink-0 mt-0.5 sm:mt-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span>{lesson.title}</span>
                  </div>
                  
                  <Link 
                    to={`/course/${course._id}/module/${module._id}/lesson/${lesson._id}`}
                    className={`shrink-0 font-bold flex items-center gap-1.5 transition-colors ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                  >
                    Start Lesson <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                </div>
              ))}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}