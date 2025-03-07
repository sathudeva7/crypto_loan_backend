import { Request, Response } from "express";
import {
  createStripeUserService,
  transferMoney,
} from "../services/fiat.service";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";
import { stripe } from "../config/utils";
import Loan from "../models/loan.model";

export const createSrtipeUserController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { user } = req;
    const { userData } = req.body;
    console.log(userData);
    await createStripeUserService(userData, user);

    res.status(200).json({ message: "Stripe user created successfully." });
  } catch (error: any) {
    // Respond with an error message, capturing error details if available
    res
      .status(400)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

export const transferMoneyController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await transferMoney(req.body.connectedAccountId, req.body.amount);

    res.status(200).json({ message: "Stripe user created successfully." });
  } catch (error: any) {
    // Respond with an error message, capturing error details if available
    res
      .status(400)
      .json({ message: error.message || "An unexpected error occurred" });
  }
};

export const createPaymentIntent = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    console.log("called");
    const { user } = req;
    const { loanId } = req.body;
    console.log(loanId);

    // ✅ Await the function to get actual order amount
    const amountDue = await calculateOrderAmount(loanId);
    
    if (!amountDue) {
      return res.status(400).json({ message: "Invalid loan ID or no amount due" });
    }
console.log(amountDue);
    // ✅ Pass the correctly resolved amount to Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountDue*100, // Now correctly passing the resolved amount
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log(paymentIntent);
    return res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "An unexpected error occurred",
    });
  }
};


const calculateOrderAmount = async (loanId: any) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  const loan = await Loan.findById(loanId);
  console.log(loan);

  return loan?.amountDue;

};
