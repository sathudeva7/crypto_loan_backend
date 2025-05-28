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
    const { error } = loanSchema.validate(req.body);
    if (error) {
      res.status(400).json({ error: error.details[0].message });
    }

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

    const { user } = req;

    if (!user) {
      res.status(401).json({ error: "Unauthorized user" });
    }

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
    const { user } = req;

    if (!user) {
      res.status(401).json({ error: "Unauthorized user" });
    }

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
    const loan = await getLoanByIdService({ id: loanId });
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

      await browser.close();
    })();
  } catch (error: any) {
    console.error("Error loading PDF:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
