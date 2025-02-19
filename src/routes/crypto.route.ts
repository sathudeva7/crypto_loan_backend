import express from 'express';
import { borrowTokenController } from '../controllers/crypto.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.use(authMiddleware);
router.route('/borrow').post(borrowTokenController);

export default router;