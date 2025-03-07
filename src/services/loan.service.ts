import Loan from "../models/loan.model";
// @ts-nocheck
export const createLoanService = async ({
  user,
  title,
  amountBorrowed,
  amountDue,
  collateral,
  borrowedCurrency,
  collateralCurrency,
  repaymentDueDate,
  category,
}: {
  user: any;
  title: string;
  amountBorrowed: number;
  borrowedCurrency: string;
  collateralCurrency?: string;
  category: string;
  amountDue: number;
  collateral?: string;
  repaymentDueDate: Date;
}) => {
  try {
    const newLoan = await Loan.create({
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

    return newLoan;
  } catch (error: any) {
    console.error("Error borrowing tokens:", error.message);
    throw new Error("Failed to create loan");
  }
};

export const getLoanByUserService = async ({ user }: { user: any }) => {
  try {
    const loans = await Loan.find({ user: user.id });
    const totalAmountBorrowed = loans.reduce((sum, item) => sum + item.amountBorrowed, 0);
    const totalAmountDue = loans.reduce((sum, item) => sum + item.amountDue, 0);
    const totalCollateral = loans.reduce((sum, item) => sum + Number(item.collateral), 0);
    
    return {loans, totalAmountBorrowed, totalAmountDue, totalCollateral};
  } catch (error: any) {
    console.error("Error borrowing loans by user:", error.message);
    throw new Error("Failed to get loan data by user");
  }
};

export const getLoanByIdService = async ({ id }: { id: string }) => {
  try {
    const loan = await Loan.findById(id);
    return loan;
  } catch (error: any) {
    console.error("Error borrowing loans by user:", error.message);
    throw new Error("Failed to get loan data by user");
  }
};
