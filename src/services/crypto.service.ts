import { ethers } from 'ethers';
import { lendingPool, wallet } from '../config/utils';
import { BORROW_GAS_LIMIT, BORROW_INTEREST_RATE_MODE, BORROW_REFERRAL_CODE, BORROW_USDC_ADDRESS, DEFAULT_DECIMALS } from '../config/constants';


export const borrowTokenService = async (borrowAmount: number, delegatorAddress: string): Promise<ethers.providers.TransactionResponse | void> => {
  try {
    // Get current gas price
    const gasPrice = await wallet.provider.getGasPrice();

    // Parse borrow amount to correct units
    const parsedBorrowAmount = ethers.utils.parseUnits(borrowAmount.toString(), DEFAULT_DECIMALS);

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

    return tx; // Return transaction object for further processing

  } catch (error: any) {
    console.error("Error borrowing tokens:", error.message);
    // Implement proper error handling logic depending on your application's needs
  }
};
