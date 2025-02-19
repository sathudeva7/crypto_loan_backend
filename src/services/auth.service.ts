import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

export const registerUserService = async ( email: string, password: string) => {
	try {
		// Check if user already exists
		console.log(email,'rem')
		console.log(User,'fdfd')
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new Error('Email already exists');
		}
		console.log('existingUser', existingUser)
		
		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
         console.log(hashedPassword,'dsd')
		// Create new user
		const user = await User.create({
			email,
			password: hashedPassword
		});
		
		console.log('user', user)

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || 'your_jwt_secret',
			{ expiresIn: '1h' }
		);

		// Return user without password and token
		const userWithoutPassword = user.toObject();

		return { user: userWithoutPassword, token };
	} catch (error) {
		throw error;
	}
}

export const loginUserService = async (email: string, password: string) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('Invalid credentials');
		}

		// Compare passwords
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error('Invalid credentials');
		}

		// Generate JWT token
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET || 'your_jwt_secret',
			{ expiresIn: '1h' }
		);

		// Return user without password and token
		const userWithoutPassword = user.toObject();
		

		return { user: userWithoutPassword, token };
	} catch (error) {
		throw error;
	}
}