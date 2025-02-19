import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	connectedAccountId: string,
	externalAccountId: string,
	walletAddress: string,
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: String,
	lastName: String,
	dob: {
		day: Number,
		month: Number,
		year: Number
	},
	connectedAccountId: String,
	externalAccountId: String,
	walletAddress: String
}, {
	timestamps: true
});

export default mongoose.model<IUser>("User", UserSchema);