# Text-to-Learn: AI-Powered Course Generator 

Text-to-Learn is a full-stack, AI-driven web application that transforms any user-submitted topic into a structured, multi-module online course instantly. It provides an end-to-end learning experience complete with AI-generated text, interactive quizzes, embedded YouTube videos, multilingual Hinglish audio explanations, and downloadable PDF study guides.

## ✨ Features
* **AI Curriculum Generation:** Uses Google Gemini (1.5 Flash) to dynamically engineer 3-6 logical modules and structured lessons from a single text prompt.
* **Rich Interactive Lessons:** Renders complex JSON structures into beautiful UI blocks including headings, paragraphs, syntax-highlighted code, and interactive Multiple-Choice Questions (MCQs).
* **Dynamic Video Curation:** Integrates the YouTube Data API v3 to automatically fetch and embed relevant educational tutorials for each lesson.
* **Multilingual Accessibility (TTS):** Leverages Gemini Translation and Google Cloud Text-to-Speech to generate Hindlish (Hindi-English) audio narrations for offline or accessible listening.
* **Offline Export:** Features a custom PDF rendering engine using `html2canvas` and `jsPDF` to download beautifully formatted lesson materials.
* **Secure Authentication:** Protected by Auth0 OAuth 2.0 with JWT backend validation for secure, personalized course saving.

## 🛠️ Technology Stack
* **Frontend:** React, Vite, TypeScript, Tailwind CSS v4, React Router v6
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **AI & External APIs:** Google Generative AI SDK (Gemini), Google Cloud TTS, YouTube Data API v3
* **Deployment:** Vercel (Frontend), Render (Backend)

## 🚀 Getting Started (Local Development)

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/yourusername/text-to-learn.git
cd text-to-learn
\`\`\`

### 2. Setup Backend
\`\`\`bash
cd server
npm install
# Create a .env file and add your MONGO_URI, GEMINI_API_KEY, YOUTUBE_API_KEY, and AUTH0 credentials.
npm run dev
\`\`\`

### 3. Setup Frontend
\`\`\`bash
cd ../client
npm install
# Create a .env file and add your VITE_API_URL and VITE_AUTH0 credentials.
npm run dev
\`\`\`