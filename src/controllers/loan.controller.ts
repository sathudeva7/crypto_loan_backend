import { Request, Response } from "express";
import Joi from "joi";
import {
  createLoanService,
  getLoanByIdService,
  getLoanByUserService,
} from "../services/loan.service";
import { IGetUserAuthInfoRequest } from "../middleware/authMiddleware";
import puppeteer from "puppeteer";

const loanSchema = Joi.object({
  title: Joi.string().min(6).required(),
  collateral: Joi.number().required(),
  amountBorrowed: Joi.number().required(),
  amountDue: Joi.number().required(),
  currency: Joi.string().required(),
  repaymentDueDate: Joi.date().required(),
});

export const createLoanController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate request body
    const { error } = loanSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }

    // Extract valid fields
    const {
      title,
      amountBorrowed,
      amountDue,
      collateral,
      borrowedCurrency,
      collateralCurrency,
      repaymentDueDate,
      category,
    } = req.body;

    // Assuming user ID is coming from authenticated request (e.g., req.user.id)
    const { user } = req; // Ensure authentication middleware adds user object

    if (!user) {
      res.status(401).json({ error: "Unauthorized user" });
    }

    // Call loan creation service
    const newLoan = await createLoanService({
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

    res.status(201).json({
      success: true,
      loan: newLoan,
    });
  } catch (error: any) {
    console.error("Error creating loan:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLoansByUserController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("call getloan");
    const { user } = req;
    console.log(user);

    if (!user) {
      res.status(401).json({ error: "Unauthorized user" });
    }

    // Fetch all loans associated with the authenticated user
    const loans = await getLoanByUserService({ user: user });

    res.status(200).json({
      success: true,
      loans,
    });
  } catch (error: any) {
    console.error("Error fetching user loans:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLoanByIdController = async (
  req: IGetUserAuthInfoRequest,
  res: Response
): Promise<void> => {
  try {
    const { loanId } = req.params;
 console.log('cccc--')
    const loan = await getLoanByIdService({ id: loanId });
  console.log(loan);
    res.status(200).json({
      success: true,
      loan,
    });
  } catch (error: any) {
    console.error("Error fetching user loans:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loadPdf = async (req: Request, res: Response): Promise<void> => {
  try {
    (async () => {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto("https://templates.qwilr.com/yD8gJucZS4iN", {
        waitUntil: "networkidle2",
      });

      await page.pdf({
        path: "output.pdf",
        format: "A4",
        landscape: true,
        printBackground: true,
        preferCSSPageSize: true,
        scale: 0.8,
        margin: { top: "20mm", bottom: "20mm", left: "10mm", right: "10mm" },
      });
      console.log("PDF created successfully");

      await browser.close();
    })();
  } catch (error: any) {
    console.error("Error loading PDF:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
