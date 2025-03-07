import mongoose, { Schema, Document, Model } from "mongoose";

// Loan Interface
export interface ILoan extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  amountBorrowed: number;
  amountDue: number;
  borrowedCurrency: string;
  collateral?: string;
  collateralCurrency?: string;
  repaymentDueDate: Date;
  category: "Home" | "Tech" | "Party" | "Trip";
  status: "pending" | "active" | "repaid" | "defaulted";
  createdAt: Date;
  updatedAt: Date;
}

// Loan Schema
const LoanSchema: Schema<ILoan> = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    title: { 
      type: String, 
      required: true, 
      trim: true,
      maxlength: 100 
    },
    amountBorrowed: { 
      type: Number, 
      required: true, 
      min: 0,
      set: (v: number) => Number(v.toFixed(2)) // Store with 2 decimal places
    },
    amountDue: { 
      type: Number, 
      required: true, 
      min: 0,
      set: (v: number) => Number(v.toFixed(2))
    },
    borrowedCurrency: {
      type: String,
      required: true,
      uppercase: true,
      default: "USD"
    },
    collateral: { 
      type: String, 
      default: 0, 
      min: 0,
    },
    collateralCurrency: {
      type: String,
      uppercase: true,
    },
    repaymentDueDate: { 
      type: Date, 
      required: true,
      validate: {
        validator: function(this: ILoan, value: Date) {
          return value > new Date();
        },
        message: "Repayment date must be in the future"
      } 
    },
    category: {
      type: String,
      required: true,
      enum: ["Home" , "Tech" , "Party" , "Trip"],
      default: "Home"
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "repaid", "defaulted"],
      default: "pending"
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
    toObject: { virtuals: true, getters: true }
  }
);

// Indexes for common query patterns
LoanSchema.index({ status: 1 });
LoanSchema.index({ repaymentDueDate: 1 });
LoanSchema.index({ user: 1, status: 1 });

// Virtual for formatted display
LoanSchema.virtual("formattedDueDate").get(function(this: ILoan) {
  return this.repaymentDueDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});

const Loan: Model<ILoan> = mongoose.model<ILoan>("Loan", LoanSchema);
export default Loan;