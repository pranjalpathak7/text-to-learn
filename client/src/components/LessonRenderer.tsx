// client/src/components/LessonRenderer.tsx
import type { ContentBlock } from '../types';
import MCQBlock from './blocks/MCQBlock';
import VideoBlock from './blocks/VideoBlock'; // We will build this next with YouTube API!

export default function LessonRenderer({ content }: { content: ContentBlock[] }) {
  if (!content || content.length === 0) {
    return <p className="text-gray-500 italic">Generating lesson content...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-gray-800 leading-relaxed">
      {content.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                {block.text}
              </h2>
            );
          
          case 'paragraph':
            return (
              <p key={index} className="text-lg">
                {block.text}
              </p>
            );

          case 'code':
            return (
              <div key={index} className="my-6 rounded-xl overflow-hidden bg-gray-900 text-gray-100 shadow-md">
                <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono uppercase tracking-wider">
                  {block.language || 'code'}
                </div>
                <pre className="p-4 overflow-x-auto text-sm font-mono">
                  <code>{block.code}</code>
                </pre>
              </div>
            );

          // Inside LessonRenderer.tsx switch statement...
          case 'video':
            return <VideoBlock key={index} query={block.query || block.text || ''} />;

          case 'mcq':
            return <MCQBlock key={index} questions={block.questions || []} />;

          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
}