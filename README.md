# Zeyo Backend

A Node.js/TypeScript backend for managing loans, crypto transactions, and fiat payments, using Express, MongoDB, Stripe, and Ethers.js.

## Features

- **User Authentication** (JWT-based)
- **Loan Management** (create, fetch, repay loans)
- **Crypto Services** (borrow and repay tokens via Ethers.js)
- **Fiat Services** (Stripe integration for account creation, transfers, and payouts)
- **PDF Generation** (via Puppeteer)
- **MongoDB** for persistent storage

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or remote)
- Stripe account (for API keys)
- Infura account (for Ethereum RPC)

## Environment Variables

Create a `.env` file in the root directory with the following:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/zeyo
JWT_SECRET=your_jwt_secret
INFURA_PROJECT_ID=your_infura_project_id
PRIVATE_KEY=your_ethereum_private_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## Installation

```bash
git clone https://github.com/yourusername/zeyo-backend.git
cd zeyo-backend
npm install
# or
yarn install
```

## Running the Project

```bash
npm run dev
# or
yarn dev
```

The server will start on the port specified in your `.env` file (default: 3000).

## Project Structure

```
src/
  config/         # Configuration files (db, utils, constants)
  controllers/    # Express route controllers
  middleware/     # Express middleware (e.g., auth)
  models/         # Mongoose models
  services/       # Business logic (auth, fiat, crypto, loan)
  utils/          # Utility files (e.g., ABIs)
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Loans
- `POST /api/loans` - Create a new loan
- `GET /api/loans/user` - Get all loans for a user
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/loans/pdf` - Generate loan PDF

### Crypto
- `POST /api/crypto/borrow` - Borrow tokens
- `POST /api/crypto/repay` - Repay borrowed tokens

### Fiat
- `POST /api/fiat/create-user` - Create Stripe user
- `POST /api/fiat/transfer` - Transfer money
- `POST /api/fiat/payment-intent` - Create payment intent

## Development

- Uses TypeScript for type safety
- Linting and formatting via ESLint and Prettier
- Error handling implemented in all services and controllers

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **ethers**: Ethereum interactions
- **stripe**: Payment processing
- **puppeteer**: PDF generation
- **dotenv**: Environment variables
- **joi**: Request validation

## Error Handling

The application implements comprehensive error handling:
- Input validation using Joi
- Try-catch blocks in all async operations
- Custom error messages for different scenarios
- Proper HTTP status codes for different error types

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Environment variables for sensitive data
- Input validation and sanitization
- Secure HTTP headers

## License

MIT