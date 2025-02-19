import Joi from "joi";
import { Request, Response } from 'express';
import { loginUserService, registerUserService } from "../services/auth.service";

const registerSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required()
});

export const registerUser = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		console.log('ddf')
		const { error } = registerSchema.validate(req.body);
		if (error) {
		  res.status(400).json({ error: error.details[0].message });
		}

		const { email, password } = req.body;
     console.log(email, password, 'in controller');
		// Call service to register user
		const { user, token } = await registerUserService(email, password);

		res.status(201).json({
			success: true,
			user: {
				id: user._id,
				email: user.email,
				createdAt: user.createdAt
			},
			token
		});
	} catch (error: any) { }
}; 

export const loginUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const { error } = loginSchema.validate(req.body);
		if (error) {
			 res.status(400).json({ error: error.details[0].message });
		}

		const { email, password } = req.body;

		const { user, token } = await loginUserService(email, password);

		res.status(200).json({
			user,
			token
		})
	} catch (error: any) { }
};
