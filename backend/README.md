# TruEstate Backend API

RESTful API server for TruEstate Retail Analytics Dashboard built with Node.js, Express, and MongoDB.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file with:
# MONGODB_URI=your_mongodb_connection_string
# PORT=5000

# Run development server
npm run dev

# Run production server
npm start

# Import data (if needed)
npm run import
```

## API Endpoints

### Transactions

- `GET /api/transactions` - Get paginated transactions with filters
- `GET /api/overview` - Get aggregated statistics
- `GET /api/filters` - Get available filter options

### Dashboard

- `GET /api/dashboard/category-sales` - Category sales data
- `GET /api/dashboard/top-products` - Top 10 products
- `GET /api/dashboard/brand-sales` - Brand-wise sales
- `GET /api/dashboard/region-sales` - Region-wise sales
- `GET /api/dashboard/payment-methods` - Payment methods distribution
- `GET /api/dashboard/sales-trends` - Monthly sales trends

### Health Check

- `GET /health` - Server health status

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route handlers
│   └── index.js         # Application entry point
├── scripts/             # Utility scripts (data import)
└── .env                 # Environment variables
```

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **ODM**: Mongoose
- **Dev Tools**: Nodemon

## Environment Variables

| Variable      | Description               | Default  |
| ------------- | ------------------------- | -------- |
| `MONGODB_URI` | MongoDB connection string | Required |
| `PORT`        | Server port               | 5000     |

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run import` - Import CSV data to MongoDB
