import express, { Request, Response } from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { appendWallet } from '../controllers/user.controller';
const router = express.Router();

router.use(authMiddleware);
router.post('/connect-wallet', async (req: Request, res: Response) => {
	await appendWallet(req, res);
})

export default router;