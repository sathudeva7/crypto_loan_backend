import mongoose, { Schema, Document } from "mongoose";

// Loan Interface
export interface ILoan extends Document {
  user: mongoose.Types.ObjectId; // Reference to the User model
  title: string;
  amountBorrowed: number;
  amountDue: number;
  collateral?: number; // Optional field
  currency: string;
  repaymentDueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Loan Schema
const LoanSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    amountBorrowed: { type: Number, required: true },
    amountDue: { type: Number, required: true },
    collateral: { type: Number, default: 0 },
    currency: { type: String, required: true },
    repaymentDueDate: { type: Date, required: true },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.model<ILoan>("Loan", LoanSchema);
