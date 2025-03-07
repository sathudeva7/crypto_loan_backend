import Joi from "joi";
import { Request, Response } from "express";
import {
	loginUserService,
	registerUserService,
} from "../services/auth.service";

const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	phoneNumber: Joi.number().min(10).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});

export const registerUser = async (req: Request, res: Response) => {
	try {
		const { error } = registerSchema.validate(req.body);
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const { email, password, phoneNumber } = req.body;
		// Call service to register user
		const { user, token } = await registerUserService(
			email,
			password,
			phoneNumber
		);

		return res.status(201).json({
			success: true,
			user: {
				id: user._id,
				email: user.email,
				createdAt: user.createdAt,
			},
			token,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { error } = loginSchema.validate(req.body);
		console.log("login");
		if (error) {
			return res.status(400).json({ error: error.details[0].message });
		}

		const { email, password } = req.body;

		const { user, token } = await loginUserService(email, password);
		console.log(user);
		return res.status(200).json({
			user,
			token,
		});
	} catch (error: any) {
		console.log(error);
		return res.status(400).json({ message: error.message });
	}
};
