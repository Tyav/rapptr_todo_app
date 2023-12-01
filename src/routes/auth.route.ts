import express from 'express';
import validate from '../middlewares/validator.middleware';
import { registerUser } from '../validations/user.validation';
import userController from '../controllers/user.controller';


const router = express.Router();

router.post('/register', validate(registerUser), userController.registerUser)

router.post('/login', validate(registerUser), userController.loginUser)

export default router;