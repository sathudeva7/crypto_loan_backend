import express from 'express';
import { createSrtipeUserController } from '../controllers/fiat.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.use(authMiddleware);
router.route('/create-stripe-user').post(createSrtipeUserController);

export default router;