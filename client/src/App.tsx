// client/src/App.tsx
import { useState, useEffect } from 'react';
import { Routes, Route, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from './context/ThemeContext';
import { apiClient, setAuthToken } from './utils/api';
import { Sun, Moon, LogOut, LogIn, Menu, X, BookOpen } from 'lucide-react';

// Import your pages and components
import PromptForm from './components/PromptForm';
import CourseView from './pages/CourseView';
import LessonView from './pages/LessonView';

const MainLayout = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);

  // THE FIX: Added location.pathname to dependencies. 
  // Now, every time you navigate (like redirecting after a course generates), this refetches.
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated) return;
      try {
        const res = await apiClient.get('/api/courses');
        setRecentCourses(res.data.slice(0, 10)); 
      } catch (error) {
        console.error('Failed to fetch recent courses', error);
      }
    };
    fetchCourses();
  }, [isAuthenticated, location.pathname]);

  // Auto-close mobile sidebar when clicking a link
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900';
  const sidebarBg = isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  return (
    // THE FIX: Switched to flex-col on mobile, flex-row on desktop for a safer layout
    <div className={`flex flex-col md:flex-row h-screen overflow-hidden transition-colors duration-300 ${bgColor}`}>
      
      {/* MOBILE HEADER (Hamburger Menu Bar - Only visible on small screens) */}
      <div className={`md:hidden w-full h-16 px-4 flex justify-between items-center shrink-0 border-b shadow-sm z-20 ${sidebarBg}`}>
        <Link to="/" className="font-black text-xl tracking-tight text-blue-600 dark:text-blue-500">
          Text-to-Learn
        </Link>
        <button 
          onClick={() => setIsMobileOpen(true)} 
          className={`p-2 rounded-lg transition-colors ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE OVERLAY (Darkens the background when menu is open) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* SIDEBAR (Slide-out on mobile, fixed on desktop) */}
      <aside className={`fixed top-0 left-0 md:relative z-50 w-72 h-full flex flex-col p-6 transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r shrink-0 ${sidebarBg}`}>
        
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="font-black text-2xl tracking-tight text-blue-600 dark:text-blue-500">
            Text-to-Learn
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)} 
            className={`md:hidden p-1.5 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Recent Courses List */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-1">
          <p className={`text-xs font-bold uppercase tracking-wider mb-3 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Recent Courses
          </p>

          {!isAuthenticated ? (
            <p className={`text-sm px-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Log in to view history.</p>
          ) : recentCourses.length === 0 ? (
            <p className={`text-sm px-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>No courses yet.</p>
          ) : (
            recentCourses.map((course) => {
              const isActive = location.pathname.includes(course._id);
              return (
                <Link 
                  key={course._id} 
                  to={`/course/${course._id}`}
                  className={`flex items-center gap-3 w-full p-3 rounded-xl text-sm font-semibold transition-all truncate ${
                    isActive 
                      ? (isDark ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') 
                      : (isDark ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100')
                  }`}
                >
                  <BookOpen className={`w-4 h-4 shrink-0 ${isActive ? 'opacity-100' : 'opacity-50'}`} />
                  <span className="truncate">{course.title}</span>
                </Link>
              );
            })
          )}
        </div>

        {/* Bottom Actions (Theme & Auth) */}
        <div className={`mt-6 pt-6 border-t space-y-3 shrink-0 ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <button onClick={toggleTheme} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors font-semibold ${isDark ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}>
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-600" />}
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {isAuthenticated ? (
            <div className="pt-2">
              <p className={`text-sm font-bold truncate mb-2 px-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.name}
              </p>
              <button 
                onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-colors font-semibold ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}
              >
                <LogOut className="w-5 h-5" /> Log Out
              </button>
            </div>
          ) : (
            <button 
              onClick={() => loginWithRedirect()}
              className="flex items-center justify-center gap-2 w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-bold shadow-md"
            >
              <LogIn className="w-5 h-5" /> Log In
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 h-full overflow-y-auto pb-10 print:pb-0 relative z-10">
        <Outlet /> 
      </main>

    </div>
  );
};

// --- APP ROUTER ---
export default function App() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setAuthToken(token);
        } catch (error) {
          console.error("Error fetching token", error);
        }
      } else {
        setAuthToken(null);
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<div className="flex flex-col items-center justify-center h-full"><PromptForm /></div>} />
        <Route path="course/:courseId" element={<CourseView />} />
        <Route path="course/:courseId/module/:moduleId/lesson/:lessonId" element={<LessonView />} />
      </Route>
      <Route path="*" element={<div className="p-10 text-center"><h1 className="text-3xl font-bold text-red-500">404 - Not Found</h1></div>} />
    </Routes>
  );
}