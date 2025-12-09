# TruEstate Retail Analytics Dashboard

A full-stack retail analytics dashboard built with React and Node.js, featuring interactive data visualization and advanced filtering capabilities for transaction data analysis.

## Overview

TruEstate is a comprehensive retail analytics platform that provides insights into sales transactions through dynamic charts, KPI tracking, and detailed data tables. The system supports multi-dimensional filtering, real-time search, and pagination for efficient data exploration.

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (Atlas Cloud)
- **Mongoose** - MongoDB ODM

### Frontend

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework
- **Recharts** - Charting library
- **Axios** - HTTP client

## Search Implementation Summary

The search functionality allows users to filter transactions by customer information:

- **Client-side**: Search input in `Header.jsx` with debounced onChange handler
- **State Management**: Search term stored in App.jsx filters state
- **API Integration**: Query parameter `search` passed to `/api/transactions`
- **Backend Processing**: MongoDB regex search on `customerName` and `phoneNumber` fields
- **Case-insensitive**: Uses MongoDB `$regex` with `$options: 'i'` for flexible matching

## Filter Implementation Summary

Advanced multi-select and range-based filtering system:

### Multi-Select Filters

- **Customer Region**: North, South, East, West
- **Gender**: Male, Female
- **Product Category**: Electronics, Clothing, Beauty, Accessories, etc.
- **Payment Method**: UPI, Credit Card, Debit Card, Cash
- **Tags**: Product tags (e.g., hot, new-arrival, premium)

### Range Filters

- **Age Range**: Min/Max numeric input (18-100)
- **Date Range**: Start/End date pickers

### Implementation

- **Frontend**: Multi-select dropdowns in `FilterPanel.jsx` with checkbox UI
- **State**: Arrays for multi-select, objects for ranges in App.jsx
- **API Serialization**: Arrays and objects serialized to JSON in query params
- **Backend**: `buildFilterQuery()` converts to MongoDB `$in` (arrays) and `$gte`/`$lte` (ranges)

## Sorting Implementation Summary

Sort transactions by various fields:

- **Available Options**: Customer Name, Date, Total Amount
- **UI Component**: Dropdown in `FilterPanel.jsx`
- **State Management**: `sort` field in filters state
- **API Parameter**: `sort` query parameter
- **Backend**: MongoDB `.sort()` with field mapping
- **Default**: Sorted by `customerName` ascending

## Pagination Implementation Summary

Efficient pagination for large datasets:

- **Page Size**: 10 transactions per page (configurable)
- **UI**: Previous/Next buttons with page numbers in `TransactionTable.jsx`
- **State**: Current page tracked in App.jsx filters
- **API**: `page` and `limit` query parameters
- **Backend**: MongoDB `.skip()` and `.limit()` for offset pagination
- **Response**: Returns `currentPage`, `totalPages`, `totalTransactions` metadata

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

### Backend Setup

1. Navigate to backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` file in backend directory:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/truestate
   PORT=5000
   ```

4. Import sample data (optional):

   ```bash
   npm run import
   ```

5. Start development server:

   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

### Production Build

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
npm run preview
```


