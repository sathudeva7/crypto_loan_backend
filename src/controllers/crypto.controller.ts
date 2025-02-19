import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { borrowTokenService } from '../services/crypto.service';
import { transferMoney } from '../services/fiat.service';
import { IGetUserAuthInfoRequest } from '../middleware/authMiddleware';

export const borrowTokenController = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  try {
    const {user} = req;

    
    const { borrowAmount, delegatorAddress } = req.body;

    // Validate delegator address using Ethers.js utility
    if (!ethers.utils.isAddress(delegatorAddress)) {
      throw new Error("Invalid delegator address");
    }

    // Validate borrowAmount to ensure it's a positive number
    if (isNaN(borrowAmount) || Number(borrowAmount) <= 0) {
      throw new Error("Invalid borrow amount");
    }

    // Add your logic here to process the borrowing of tokens
    const borrowResponse = await borrowTokenService(borrowAmount, delegatorAddress);
    // Respond with a success message
    if (borrowResponse) {
      transferMoney("acct_1", borrowAmount);
    }
    res.status(200).json({ message: "Tokens borrowed successfully." });

  } catch (error: any) {
    // Respond with an error message, capturing error details if available
    res.status(400).json({ message: error.message || "An unexpected error occurred" });
  }
};
