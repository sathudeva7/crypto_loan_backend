import { ethers } from "ethers";
import { LENDING_POOL_ADDRESS, PROVIDER_RPC_URL } from "./constants";
import { borrowAbi } from "../utils/borrow.abi";
import dotenv from "dotenv";
import Stripe from 'stripe';

dotenv.config();
// Ensure that environmental variables are correctly accessed
const { INFURA_PROJECT_ID, PRIVATE_KEY, STRIPE_SECRET_KEY } = process.env;

if (!INFURA_PROJECT_ID) {
  throw new Error("INFURA_PROJECT_ID is not defined in the environment variables.");
}

if (!PRIVATE_KEY) {
  throw new Error("PRIVATE_KEY is not defined in the environment variables.");
}

// Create a provider using Infura project ID
const provider = new ethers.providers.JsonRpcProvider(`${PROVIDER_RPC_URL}/${INFURA_PROJECT_ID}`);
console.log(provider);
// Initialize wallet using the private key and provider
export const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Define the lending pool contract instance
export const lendingPool = new ethers.Contract(
  LENDING_POOL_ADDRESS,
  borrowAbi,
  wallet
);

export const stripe = new Stripe('sk_test_51IBPAuCNNrXsusT4azISSriWDbL0PPJH6DXPFieSC4EGm0mJjwRN0nfaUziDIjogXVZPmIlfv7be5vmWJsvxI7EX00wj3JTJ9N');
