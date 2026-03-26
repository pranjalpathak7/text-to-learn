// server/routes/mediaRoutes.js
import express from 'express';
import { getYouTubeVideo, generateHinglishAudio } from '../controllers/mediaController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(requireAuth); // Secure these endpoints

router.get('/youtube', getYouTubeVideo);
router.post('/tts', generateHinglishAudio);

export default router;