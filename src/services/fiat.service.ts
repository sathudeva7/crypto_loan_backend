import { stripe } from "../config/utils";
import User from "../models/user.model";

interface UserData {
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

export const createStripeUserService = async (
	userData: UserData,
	user: any
): Promise<{ connectedAccountId: string; externalAccountId: string } | void> => {
	try {
		const [day, month, year] = userData.dob.split('/');

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
				mcc: "5734",
				url: "www.abc.com",
			},
		});

		const externalAccount = await stripe.accounts.createExternalAccount(
			connectedAccount.id,
			{ external_account: bankAccountToken.id }
		);

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
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error borrowing tokens:", error.message);
			throw new Error(`Stripe user creation failed: ${error.message}`);
		}
		throw new Error("Stripe user creation failed: Unknown error");
	}
};

export const transferMoney = async (
	connectedAccountId: string,
	amount: number
): Promise<any> => {
	try {
		const transfer = await stripe.transfers.create({
			amount: amount * 10,
			currency: "eur",
			destination: connectedAccountId,
			description: "Transfer to connected account",
		});

		const waitForFunds = async () => {
			let retries = 0;
			const maxRetries = 10;
			while (retries < maxRetries) {
				const balance = await stripe.balance.retrieve(
					{},
					{ stripeAccount: connectedAccountId }
				);

				const availableFunds = balance.available.find(
					(b: { currency: string; amount: number }) => b.currency === "gbp"
				);

				if (availableFunds && availableFunds.amount >= 1) {
					return;
				}

				retries++;
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
			throw new Error("Funds did not become available in time.");
		};

		const balance = await stripe.balance.retrieve(
			{},
			{ stripeAccount: connectedAccountId }
		);

		const availableFunds = balance.available.find(
			(b: { currency: string; amount: number }) => b.currency === "gbp"
		);

		if (!availableFunds || availableFunds.amount < 1) {
			throw new Error("Funds are not available for payout.");
		}

		const payout = await stripe.payouts.create(
			{
				amount: balance.available[0].amount,
				currency: "eur",
				description: "Payout to bank account",
			},
			{
				stripeAccount: connectedAccountId,
			}
		);

		return payout;
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Error borrowing tokens:", error.message);
			throw new Error(`Transfer failed: ${error.message}`);
		}
		throw new Error("Transfer failed: Unknown error");
	}
};
