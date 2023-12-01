import express from 'express';
import todoRoutes from './todo.route';
import authRoutes from './auth.route';
const router = express.Router();

router.use('/todos', todoRoutes);
router.use('/auth', authRoutes);

export default router;
