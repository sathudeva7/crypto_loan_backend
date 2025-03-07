import { ethers } from 'ethers';
import { lendingPool, usdcContract, wallet } from '../config/utils';
import { BORROW_GAS_LIMIT, BORROW_INTEREST_RATE_MODE, BORROW_REFERRAL_CODE, BORROW_USDC_ADDRESS, DEFAULT_DECIMALS } from '../config/constants';


export const borrowTokenService = async (borrowAmount: number, delegatorAddress: string): Promise<ethers.providers.TransactionResponse | void> => {
  try {
    // Get current gas price
    const gasPrice = await wallet.provider.getGasPrice();

    // Parse borrow amount to correct units
    const parsedBorrowAmount = ethers.utils.parseUnits(borrowAmount.toString(), DEFAULT_DECIMALS);
console.log('in borrow---', delegatorAddress);
    // Create transaction
    const tx = await lendingPool.borrow(
      BORROW_USDC_ADDRESS,
      parsedBorrowAmount,
      BORROW_INTEREST_RATE_MODE,
      BORROW_REFERRAL_CODE,
      delegatorAddress, // Use parameter directly
      {
        gasLimit: BORROW_GAS_LIMIT,
        gasPrice: gasPrice.mul(15).div(10), // 1.5x current gas price
      }
    );

    console.log("Borrow transaction submitted, hash:", tx.hash);

    // Wait for confirmation (optional)
    await tx.wait()
      .then((receipt: any) =>
        console.log(`Transaction confirmed in block ${receipt.blockNumber}`)
      )
      .catch(console.error);
    
    console.log("Tokens borrowed successfully.");

    

    return tx; // Return transaction object for further processing

  } catch (error: any) {
    console.error("Error borrowing tokens:", error.message);
    // Implement proper error handling logic depending on your application's needs
  }
};

export const repayStableService = async (repayAmount: number, borrowerAddress: string) => {
  try {
    // Get current gas price
    const gasPrice = await wallet.provider.getGasPrice();
    console.log("Current Gas Price:", ethers.utils.formatUnits(gasPrice, "gwei"), "Gwei");

    // Step 1: Approve USDC for repayment
    console.log("Approving USDC for repayment...");
    const approveTx = await usdcContract.approve(
      lendingPool.address,
      ethers.utils.parseUnits(repayAmount.toString(), 6),
      {
        gasLimit: BORROW_GAS_LIMIT || 300000, // Default to 300k if not set
        gasPrice: gasPrice.mul(15).div(10), // Increase gas price by 1.5x to ensure execution
      }
    );
    await approveTx.wait(); // Wait for approval confirmation
    console.log("USDC Approval Transaction Hash:", approveTx.hash);

    // Step 2: Repay the loan
    console.log("Repaying Aave Loan...");
    const tx = await lendingPool.repay(
      BORROW_USDC_ADDRESS,  // Asset to repay (e.g., USDC)
      ethers.utils.parseUnits(repayAmount.toString(), 6),  // Amount to repay (10 USDC)
      BORROW_INTEREST_RATE_MODE,  // Interest Rate Mode (1 = Stable, 2 = Variable)
      borrowerAddress,  // Address of the borrower (Person A)
      {
        gasLimit: BORROW_GAS_LIMIT || 300000, // Default to 300k if not set
        gasPrice: gasPrice.mul(15).div(10), // Increase gas price by 1.5x to ensure execution
      }
    );

    await tx.wait(); // Wait for repayment confirmation
    console.log("Loan Repayment Successful! Transaction Hash:", tx.hash);

    return tx; // Return the transaction object if needed
  } catch (error: any) {
    console.error("Error repaying loan:", error.message);
    throw new Error("Loan repayment failed. Please check logs.");
  }
};