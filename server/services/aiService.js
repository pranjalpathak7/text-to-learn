import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// We use the modern gemini-1.5-flash model for speed and cost-effectiveness in JSON generation
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Milestone 8.1: Generate Course Outline
 * Input: Topic string [cite: 160]
 * Output: JSON Object with course metadata and modules [cite: 163]
 */
export const generateCourseOutline = async (topic) => {
  const prompt = `Create a comprehensive, highly structured online course outline for the topic: "${topic}". 
  The curriculum should progress logically from foundational to advanced concepts. Generate 3 to 6 modules, each containing 3 to 5 lesson titles.`;

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING, description: "Catchy course title" },
      description: { type: SchemaType.STRING, description: "Detailed 2-3 sentence overview of the course" },
      tags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      modules: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING, description: "Title of the module" },
            lessons: { 
              type: SchemaType.ARRAY, 
              items: { type: SchemaType.STRING, description: "Title of the lesson" } 
            }
          },
          required: ["title", "lessons"]
        }
      }
    },
    required: ["title", "description", "tags", "modules"]
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(result.response.text());
};

/**
 * Milestone 8.2: Generate Detailed Lesson Content
 * Input: Course, Module, and Lesson titles [cite: 166]
 * Output: JSON Object with structured blocks (text, code, video query, MCQs) [cite: 167-173]
 */
export const generateLessonContent = async (courseTitle, moduleTitle, lessonTitle) => {
  const prompt = `You are an expert educator. Create detailed lesson content for the lesson titled "${lessonTitle}", which is part of the module "${moduleTitle}" in the course "${courseTitle}".
  
  Provide clear objectives and a rich content array consisting of mixed blocks: 'heading', 'paragraph', 'code' (only if relevant), a 'video' search query, and a 'mcq' block containing 4-5 questions at the end with explanations. [cite: 168-173]`;

  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING },
      objectives: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
      content: {
        type: SchemaType.ARRAY,
        description: "Array of content blocks. Types allowed: heading, paragraph, code, video, mcq",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            type: { type: SchemaType.STRING, description: "Must be one of: heading, paragraph, code, video, mcq" },
            text: { type: SchemaType.STRING, description: "Used for heading and paragraph types" },
            language: { type: SchemaType.STRING, description: "Used for code blocks (e.g., python, javascript)" },
            code: { type: SchemaType.STRING, description: "The actual code snippet" },
            query: { type: SchemaType.STRING, description: "A highly specific YouTube search query for this exact topic (for video type)" },
            questions: {
              type: SchemaType.ARRAY,
              description: "Used only for the mcq type. Array of 4-5 questions.",
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  question: { type: SchemaType.STRING },
                  options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                  answerIndex: { type: SchemaType.NUMBER, description: "0-based index of correct option" },
                  explanation: { type: SchemaType.STRING, description: "Why this answer is correct" }
                },
                required: ["question", "options", "answerIndex", "explanation"]
              }
            }
          },
          required: ["type"]
        }
      }
    },
    required: ["title", "objectives", "content"]
  };

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(result.response.text());
};