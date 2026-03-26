// server/controllers/mediaController.js
import axios from 'axios';
import textToSpeech from '@google-cloud/text-to-speech';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Initialize Google Cloud TTS Client
const ttsClient = new textToSpeech.TextToSpeechClient(); 

// @desc    Search YouTube for a specific educational video
// @route   GET /api/media/youtube?query=...
export const getYouTubeVideo = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${query} tutorial education`, // Appending keywords to improve educational relevance
        maxResults: 1,
        type: 'video',
        videoEmbeddable: 'true',
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ message: 'No video found for this query.' });
    }

    const videoId = response.data.items[0].id.videoId;
    res.status(200).json({ videoId });
  } catch (error) {
    console.error('YouTube API Error:', error.message);
    res.status(500).json({ message: 'Failed to fetch video' });
  }
};

// @desc    Translate text to Hinglish and generate TTS audio
// @route   POST /api/media/tts
export const generateHinglishAudio = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Text is required' });

    // Step 1: Translate to Hinglish using Gemini [cite: 191, 195]
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Translate the following educational text into Hinglish (a conversational mix of Hindi written in the Latin alphabet and English). Keep technical terms in English. Text: "${text}"`;
    
    const translationResult = await model.generateContent(prompt);
    const hinglishText = translationResult.response.text();

    // Step 2: Generate Audio using Google Cloud TTS [cite: 192, 196]
    const request = {
      input: { text: hinglishText },
      voice: { languageCode: 'en-IN', name: 'en-IN-Neural2-B' }, // A natural Indian-accented voice
      audioConfig: { audioEncoding: 'MP3' },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    // Send the audio buffer directly to the client
    res.set('Content-Type', 'audio/mpeg');
    res.send(response.audioContent);

  } catch (error) {
    console.error('TTS Error:', error);
    res.status(500).json({ message: 'Failed to generate audio explanation' });
  }
};