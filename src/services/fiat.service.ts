import { stripe } from "../config/utils";
import User from "../models/user.model";

interface userData  {
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
	email: string;
	firstName: string;
	lastName: string;
	address: {
		line1: string;
		city: string;
		postalCode: string;
		country: string;
	};
	dob: string;
}

export const createStripeUserService = async (userData: userData, user: any) => {
	try {
		const [day, month, year] = userData.dob.split('/');
		// Step 1: Create a Bank Account Token
		const bankAccountToken = await stripe.tokens.create({
			bank_account: {
				country: "GB",
				currency: "gbp",
				account_holder_name: userData.accountHolderName,
				account_holder_type: "individual",
				routing_number: userData.sortCode,
				account_number: userData.accountNumber,
			},
		});
		console.log("✅ Bank account token created:", bankAccountToken.id, userData);

		// Step 2: Create a Connected Account
		const connectedAccount = await stripe.accounts.create({
			type: "custom",
			country: "GB",
			email: user.email,
			business_type: "individual",
			capabilities: {
				transfers: { requested: true },
			},
			tos_acceptance: {
				date: Math.floor(Date.now() / 1000),
				ip: "127.0.0.1",
				service_agreement: "full",
			},
			individual: {
				first_name: userData.firstName,
				last_name: userData.lastName,
				email: user.email,
				address: {
					line1: userData.address.line1,
					city: userData.address.city,
					postal_code: userData.address.postalCode,
					country: userData.address.country,
				},
				dob: {
					day: parseInt(day),
					month: parseInt(month),
					year: parseInt(year),
				},
			},
			business_profile: {
				mcc: "5734", // Valid Merchant Category Code
				url: "www.abc.com",
			},
		});
		console.log("✅ Connected account created:", connectedAccount.id);

		// Step 3: Attach Bank Account to the Connected Account
		const externalAccount = await stripe.accounts.createExternalAccount(
			connectedAccount.id,
			{ external_account: bankAccountToken.id }
		);
		console.log(
			"✅ Bank account added to connected account:",
			externalAccount.id
		);

		//fIND USER BY EMAIL AND ADD CONNECTED ACCOUNT ID TO DB
		const existingUser = await User.findById(user?._id);

		if (!existingUser) {
			throw new Error("User not found");
		}

		existingUser.connectedAccountId = connectedAccount.id;
		existingUser.externalAccountId = externalAccount.id;

		await existingUser.save();

		return {
			connectedAccountId: connectedAccount.id,
			externalAccountId: externalAccount.id,
		};
	} catch (error: any) {
		console.error("Error borrowing tokens:", error.message);
		// Implement proper error handling logic depending on your application's needs
	}
};

export const transferMoney = async (connectedAccountId: string, amount: number) => {
	try {
		// Step 4: Transfer Funds to the Connected Account
		const transfer = await stripe.transfers.create({
			amount: amount* 10, // 5000 pence = £50
			currency: "eur", // ✅ Ensure the transfer currency is GBP
			destination: connectedAccountId,
			description: "Transfer to connected account",
		});

		console.log("✅ Transfer successful:", transfer.id);

		// Step 5: Wait for Funds to Become Available
		const waitForFunds = async () => {
			let retries = 0;
			const maxRetries = 10;
			while (retries < maxRetries) {
				const balance = await stripe.balance.retrieve(
					{},
					{ stripeAccount: connectedAccountId }
				);
				console.log(balance);
				const availableFunds = balance.available.find(
					(b) => b.currency === "gbp"
				);

				if (availableFunds && availableFunds.amount >= 1) {
					console.log("✅ Funds are now available for payout.");
					return;
				}

				console.log(
					`⏳ Waiting for funds... Retry ${retries + 1}/${maxRetries}`
				);
				retries++;
				await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before checking again
			}
			throw new Error("🚨 Funds did not become available in time.");
		};

		//await waitForFunds();

		const balance = await stripe.balance.retrieve(
			{},
			{ stripeAccount: connectedAccountId }
		);
		console.log(balance);

		// Step 6: Create a Payout from the Connected Account
		const payout = await stripe.payouts.create(
			{
				amount: balance.available[0].amount, // 200 pence = £2.00
				currency: "eur",
				description: "Payout to bank account",
			},
			{
				stripeAccount: connectedAccountId, // ✅ This ensures the payout is from the connected account
			}
		);

		console.log("✅ Payout successful:", payout.id);

		return payout;
	} catch (error: any) {
		console.error("Error borrowing tokens:", error.message);
		// Implement proper error handling logic depending on your application's needs
	}
};
