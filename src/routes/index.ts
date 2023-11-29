import express from 'express';
import todoRoutes from './todo.route';
const router = express.Router();

router.use('/todos', todoRoutes);

export default router;
