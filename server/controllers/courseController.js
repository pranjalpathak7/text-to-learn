// server/controllers/courseController.js
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import { generateCourseOutline, generateLessonContent } from '../services/aiService.js';

export const createCourseOutline = async (req, res) => {
  try {
    const { topic } = req.body;
    const auth0Id = req.user.auth0Id;
    if (!topic) return res.status(400).json({ message: 'Topic is required' });

    const outlineData = await generateCourseOutline(topic);
    const course = new Course({
      title: outlineData.title,
      description: outlineData.description,
      tags: outlineData.tags,
      creator: auth0Id,
    });
    await course.save();

    const moduleIds = [];
    for (const modData of outlineData.modules) {
      const module = new Module({
        title: modData.title,
        course: course._id,
      });
      await module.save();

      const lessonIds = [];
      for (const lessonTitle of modData.lessons) {
        const lesson = new Lesson({
          title: lessonTitle,
          content: [],
          module: module._id,
        });
        await lesson.save();
        lessonIds.push(lesson._id);
      }
      module.lessons = lessonIds;
      await module.save();
      moduleIds.push(module._id);
    }
    course.modules = moduleIds;
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error generating course:', error);
    res.status(500).json({ message: 'Failed to generate course outline' });
  }
};

export const enrichLesson = async (req, res) => {
  try {
    const { lessonId } = req.body;

    // 1. Find the lesson to get the titles for Gemini
    const lesson = await Lesson.findById(lessonId).populate({
      path: 'module',
      populate: { path: 'course' }
    });

    if (!lesson) {
      console.error("Lesson ID not found in database:", lessonId);
      return res.status(404).json({ message: "Lesson not found" });
    }

    // 2. If already enriched, return it
    if (lesson.isEnriched) {
      return res.status(200).json(lesson);
    }

    const moduleTitle = lesson.module?.title || "General Topic";
    const courseTitle = lesson.module?.course?.title || "General Course";

    console.log(`Enriching: ${courseTitle} > ${moduleTitle} > ${lesson.title}`);

    // 3. Generate AI content
    const enrichedData = await generateLessonContent(courseTitle, moduleTitle, lesson.title);

    // 4. ATOMIC UPDATE: This entirely bypasses the VersionError mismatch!
    // It directly overwrites the fields in the database without checking __v
    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: {
          content: enrichedData.content,
          objectives: enrichedData.objectives,
          isEnriched: true
        }
      },
      { returnDocument: 'after' }
    );

    res.status(200).json(updatedLesson);
  } catch (error) {
    console.error("DETAILED ENRICHMENT ERROR:", error);
    res.status(500).json({ message: "Failed to enrich lesson content." });
  }
};

export const getUserCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user.auth0Id }).sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'modules',
        populate: { path: 'lessons' }
      });

    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (course.creator !== req.user.auth0Id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching course details' });
  }
};