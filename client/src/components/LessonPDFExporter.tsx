// client/src/components/LessonPDFExporter.tsx
import { Printer } from 'lucide-react';

export default function LessonPDFExporter() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
    >
      <Printer className="w-5 h-5" />
      Save as PDF
    </button>
  );
}