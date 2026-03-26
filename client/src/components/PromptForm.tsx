import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useApi } from '../hooks/useApi';
import { useTheme } from '../context/ThemeContext'; // Import this
import { Sparkles, Loader2 } from 'lucide-react';

export default function PromptForm() {
  const [topic, setTopic] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const { theme } = useTheme(); // Consume the theme
  const { loading, error, execute } = useApi<{ _id: string }>();

  // Explicitly calculate container styles
  const containerStyle = theme === 'dark' 
    ? 'bg-gray-900 border-gray-800 text-white' 
    : 'bg-white border-gray-100 text-gray-900';

  const inputStyle = theme === 'dark'
    ? 'border-gray-700 focus:ring-blue-500 text-white placeholder-gray-500'
    : 'border-gray-200 focus:ring-blue-500 text-gray-900 placeholder-gray-400';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return loginWithRedirect();
    if (!topic.trim()) return;

    try {
      const response = await execute('post', '/api/courses/generate-outline', { topic });
      if (response?._id) navigate(`/course/${response._id}`);
    } catch (err) {
      console.error("Form submission failed");
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-10 rounded-3xl shadow-xl border transition-all duration-300 ${containerStyle}`}>
      <h2 className="text-3xl font-bold mb-3">What do you want to learn?</h2>
      <p className={`mb-8 text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        Enter a topic, and our AI will generate a complete course for you.
      </p>

      <form onSubmit={handleGenerate} className="flex flex-col gap-6">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Quantum Computing, Basics of Photography..."
          className={`w-full p-5 text-xl bg-transparent border rounded-2xl outline-none ring-offset-transparent focus:ring-2 transition-all ${inputStyle}`}
          disabled={loading}
        />
        
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading || (!topic.trim() && isAuthenticated)}
          className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-5 rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 className="animate-spin w-6 h-6" /> Building your course...</>
          ) : !isAuthenticated ? (
            'Log in to Generate'
          ) : (
            <><Sparkles className="w-6 h-6" /> Generate Course</>
          )}
        </button>
      </form>
    </div>
  );
}