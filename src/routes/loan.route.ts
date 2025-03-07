import express from 'express';
import authMiddleware from '../middleware/authMiddleware';
import { createLoanController, getLoanByIdController, getLoansByUserController, loadPdf } from '../controllers/loan.controller';
const router = express.Router();

router.use(authMiddleware);
router.route('/create-loan').post(createLoanController);
router.route('/get-loan').get(getLoansByUserController);
router.route('/pdf').get(loadPdf);
router.route('/get-loan/:loanId').get(getLoanByIdController);

export default router;