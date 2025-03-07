import express, { Request, Response }  from 'express';
import { borrowTokenController, repayController } from '../controllers/crypto.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.use(authMiddleware);
router.route('/borrow').post(borrowTokenController);
router.post('/repay', async (req: Request, res: Response) => {
	await repayController(req, res);
})

export default router;