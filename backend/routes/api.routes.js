import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { fetchQuestionsStream } from '../controllers/quiz.controller.js';
import { 
  submitEvaluationMatrix, 
  aggregateDashboardTelemetry, 
  deleteHistoryRecord,
  bookmarkQuestion,
  getSavedQuestions,
  explainQuestionWithAI
} from '../controllers/analytics.controller.js';
import { getGlobalLeaderboard } from '../controllers/leaderboard.controller.js';

const router = Router();

router.get('/quizzes/stream', requireAuth, fetchQuestionsStream);
router.post('/quizzes/evaluate', requireAuth, submitEvaluationMatrix);
router.get('/analytics/telemetry', requireAuth, aggregateDashboardTelemetry);
router.get('/leaderboard', requireAuth, getGlobalLeaderboard);
router.delete('/analytics/history/:id', requireAuth, deleteHistoryRecord); 

// 🔥 NAYE DB AUR AI Endpoints 🔥
router.post('/analytics/bookmark', requireAuth, bookmarkQuestion);
router.get('/analytics/bookmarks', requireAuth, getSavedQuestions);
router.post('/analytics/explain', requireAuth, explainQuestionWithAI);

export default router;