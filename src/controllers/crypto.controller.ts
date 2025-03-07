import { Request, Response } from "express";
import { ethers } from "ethers";
import {
  borrowTokenService,
  repayStableService,
} from "../services/crypto.service";
import { transferMoney } from "../services/fiat.service";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";
import { createLoanService } from "../services/loan.service";
import Loan from "../models/loan.model";

export const borrowTokenController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;

    const {
      borrowAmount,
      delegatorAddress,
      title,
      amountBorrowed,
      amountDue,
      collateral,
      borrowedCurrency,
      collateralCurrency,
      repaymentDueDate,
      category,
    } = req.body;
    console.log(delegatorAddress, "delegatorAddress");
    // Validate delegator address using Ethers.js utility
    if (!ethers.utils.isAddress(delegatorAddress)) {
      throw new Error("Invalid delegator address");
    }

    // Validate borrowAmount to ensure it's a positive number
    if (isNaN(borrowAmount) || Number(borrowAmount) <= 0) {
      throw new Error("Invalid borrow amount");
    }

    // Add your logic here to process the borrowing of tokens
    const borrowResponse = await borrowTokenService(
      borrowAmount,
      delegatorAddress
    );
    // Respond with a success message
    if (borrowResponse) {
      const saveDb = await createLoanService({
        user,
        title,
        amountBorrowed,
        amountDue,
        collateral,
        borrowedCurrency,
        collateralCurrency,
        repaymentDueDate,
        category,
      });
      console.log(saveDb);
      const connectedAccountId = user.connectedAccountId;
      await transferMoney(connectedAccountId, borrowAmount);
    }
    res.status(200).json({ message: "Tokens borrowed successfully." });
  } catch (error: any) {
    // Respond with an error message, capturing error details if available
    res
      .status(400)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

export const repayController = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { repayAmount, borrowerAddress, loanId } = req.body;
    console.log('reapy calledd')
    console.log(repayAmount, borrowerAddress);
    const res = await repayStableService(repayAmount, borrowerAddress);
    console.log(res);

      const updatedLoan = await Loan.findByIdAndUpdate(
            loanId,
            { status: "repaid" , amountDue: 0},
            { new: true } // Return updated document
          );
          console.log(updatedLoan);
    
    return res.status(200).json({ message: "Tokens borrowed successfully." });
  } catch (error: any) {}
};
