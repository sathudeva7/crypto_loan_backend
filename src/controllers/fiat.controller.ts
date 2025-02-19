import { Request, Response } from 'express';
import { createStripeUserService } from '../services/fiat.service';
import { IGetUserAuthInfoRequest } from '../middleware/authMiddleware';

export const createSrtipeUserController = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const {user} = req;
    const { userData } = req.body;

    await createStripeUserService(userData, user);

    res.status(200).json({ message: "Stripe user created successfully." });
  } catch (error: any) {
    // Respond with an error message, capturing error details if available
    res.status(400).json({ message: error.message || "An unexpected error occurred" });
  }
};
