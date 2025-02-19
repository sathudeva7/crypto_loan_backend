import { Request, Response } from 'express';

export const registerUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
	} catch (error: any) {
		// Respond with an error message, capturing error details if available
		res
			.status(400)
			.json({ message: error.message || "An unexpected error occurred" });
	}
};
