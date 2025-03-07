import express, { Request, Response } from 'express';
import { createPaymentIntent, createSrtipeUserController, transferMoneyController } from '../controllers/fiat.controller';
import authMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.use(authMiddleware);
router.route('/create-stripe-user').post(createSrtipeUserController);
router.route('/transfer-money').post(transferMoneyController);

router.post('/create-payment-intent', async (req: Request, res: Response) => {
	await createPaymentIntent(req, res);
})
export default router;