import { Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";
import { appendWalletService } from "../services/user.service";

export const appendWallet = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
	const { user } = req;
	const { wallet } = req.body;
	console.log('user', wallet);
    console.log('waalet', wallet);
	if (!user) {
		 res.status(401).json({ error: "Unauthorized user" });
	}

	// Call loan creation service
	const resp = await appendWalletService({ user, wallet: wallet });

	return res.status(200).json({
		success: true,
		message: 'Wallet Added Successfully',
	});

  } catch (error: any) {
    console.error("Error creating loan:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
