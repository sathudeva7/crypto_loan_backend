import User from "../models/user.model";

export const appendWalletService = async ({
  user,
  wallet,
}: {
  user: any;
  wallet: string;
}) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { walletAddress: wallet },
      { new: true } // Return updated document
    );
    return updatedUser;
  } catch (error: any) {
    console.error("Error borrowing tokens:", error.message);
    throw new Error("Failed to create loan");
  }
};
