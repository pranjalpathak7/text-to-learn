// server/routes/courseRoutes.js
import express from 'express';
import { 
  createCourseOutline, 
  enrichLesson, 
  getUserCourses, 
  getCourseById 
} from '../controllers/courseController.js';

// This is the line that was missing/commented out!
import { requireAuth, attachUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Secure these endpoints with Auth0
router.use(requireAuth);
router.use(attachUser);

router.post('/generate-outline', createCourseOutline);
router.post('/generate-lesson', enrichLesson);
router.get('/', getUserCourses);
router.get('/:id', getCourseById);

export default router;