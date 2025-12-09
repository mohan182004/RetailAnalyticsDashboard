# TruEstate Retail Analytics Dashboard - Architecture Documentation

## Table of Contents

1. [Backend Architecture](#backend-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Data Flow](#data-flow)
4. [Folder Structure](#folder-structure)
5. [Module Responsibilities](#module-responsibilities)

---

## Backend Architecture

### Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas Cloud)
- **ODM**: Mongoose
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

### Architecture Pattern

**RESTful API with MVC-inspired structure**

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ HTTP/REST
       ▼
┌─────────────┐
│  Express    │ ◄── Middleware (CORS, JSON Parser)
│   Routes    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MongoDB   │ ◄── Mongoose ODM
│   Database  │
└─────────────┘
```

### Core Components

#### 1. **Entry Point** (`src/index.js`)

- Initializes Express application
- Connects to MongoDB via Mongoose
- Configures middleware (CORS, JSON parsing)
- Mounts API routes under `/api` prefix
- Provides health check endpoint at `/health`
- Starts server on port 5000 (configurable via environment)

#### 2. **Database Configuration** (`src/config/db.js`)

- Establishes MongoDB connection using Mongoose
- Handles connection errors and success logging
- Uses connection string from environment variables

#### 3. **Data Models** (`src/models/Transaction.js`)

- Defines Mongoose schema for transaction data
- Includes fields: transactionId, date, customer info, product info, pricing, payment details
- Implements indexes on frequently queried fields (date, productCategory, brand, region, gender)
- Creates compound indexes for common query patterns

#### 4. **API Routes** (`src/routes/api.js`)

- **GET** `/api/transactions` - Paginated transaction list with filtering, search, sorting
- **GET** `/api/overview` - Aggregated statistics (total quantity, amount, discount)
- **GET** `/api/filters` - Available filter options (brands, categories, regions, tags)
- **GET** `/api/dashboard/category-sales` - Category-wise sales aggregation
- **GET** `/api/dashboard/top-products` - Top 10 products by sales
- **GET** `/api/dashboard/brand-sales` - Brand-wise sales statistics
- **GET** `/api/dashboard/region-sales` - Region-wise sales distribution
- **GET** `/api/dashboard/payment-methods` - Payment method distribution
- **GET** `/api/dashboard/sales-trends` - Monthly sales trends over time

#### 5. **Query Building**

- **buildFilterQuery()**: Converts query parameters into MongoDB filter objects
- Supports multi-select filters (regions, genders, categories, payment methods, tags)
- Supports range filters (age, date)
- Implements text search on customer name and phone number
- Handles date range filtering with proper parsing

---

## Frontend Architecture

### Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: Date-fns, React Datepicker
- **State Management**: React Hooks (useState, useEffect, useCallback)

### Architecture Pattern

**Component-Based Architecture with Centralized API Service**

```
┌─────────────────┐
│      App.jsx    │ ◄── Main Container
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────┐   ┌──────┐
│Views│   │Layout│
└──┬──┘   └───┬──┘
   │          │
   ▼          ▼
┌──────────────────────┐
│   UI Components      │
│ (Charts, Tables,     │
│  Filters, etc.)      │
└──────────┬───────────┘
           │
           ▼
    ┌─────────────┐
    │ API Service │ ◄── Axios
    └─────────────┘
           │
           ▼
    ┌─────────────┐
    │   Backend   │
    └─────────────┘
```

### Core Components

#### 1. **Main Application** (`App.jsx`)

- Root component managing application state
- Handles view routing (Dashboard vs Services)
- Manages filters, pagination, and data fetching
- Coordinates between child components
- Implements search and filter change handlers

#### 2. **Layout Components**

- **Sidebar** (`Sidebar.jsx`): Navigation with collapsible behavior
- **Header** (`Header.jsx`): Top bar with search functionality

#### 3. **Dashboard Views**

- **DashboardView** (`DashboardView.jsx`): Main dashboard container
- **CategorySalesChart**: Pie chart for category distribution
- **TopProductsChart**: Bar chart for top 10 products
- **BrandSalesChart**: Bar chart for brand comparisons
- **RegionSalesChart**: Pie chart with custom labels for regions
- **PaymentMethodsChart**: Bar chart for payment methods
- **SalesTrendsChart**: Area chart for monthly trends

#### 4. **Data Views**

- **FilterPanel** (`FilterPanel.jsx`): Multi-select dropdowns and range filters
  - Multi-select: Customer Region, Gender, Product Category, Payment Method, Tags
  - Range filters: Age, Date Range
  - Clear filters functionality
- **StatsRow** (`StatsRow.jsx`): KPI cards (Total Units, Total Amount, Total Discount)
- **TransactionTable** (`TransactionTable.jsx`): Paginated data table with 13 columns
  - Displays: Transaction ID, Date, Customer info, Product info, Quantity, Amount
  - Implements hover effects and pagination controls

#### 5. **API Service Layer** (`services/api.js`)

- Centralized API communication using Axios
- Base URL configuration
- Query parameter building for complex filters
- Exports methods: `getTransactions()`, `getOverview()`, `getFilters()`, `getDashboardData()`
- Handles array and object serialization for multi-select and range filters

#### 6. **Styling** (`styles/`)

- **index.css**: Global Tailwind imports and custom utilities
- **App.css**: Component-specific styles

---

## Data Flow

### 1. Initial Application Load

```
User opens app
    ↓
App.jsx initializes
    ↓
Fetch filter options from /api/filters
    ↓
Set filterOptions state (regions, categories, tags, etc.)
    ↓
Fetch initial data (transactions + overview)
    ↓
Render Dashboard or Services view
```

### 2. Services View Data Flow

```
User changes filters
    ↓
handleFilterChange() in App.jsx
    ↓
Update filters state (reset page to 1)
    ↓
useEffect triggers fetchData()
    ↓
API Service: buildQueryParams(filters)
    ↓
Parallel API calls:
  - getTransactions(filters) → /api/transactions?page=1&limit=10&...
  - getOverview(filters) → /api/overview?...
    ↓
Update state:
  - setTransactions()
  - setPagination()
  - setOverview()
    ↓
Re-render:
  - FilterPanel shows selected filters
  - StatsRow shows KPIs
  - TransactionTable shows filtered data
```

### 3. Dashboard View Data Flow

```
User clicks "Dashboard" in sidebar
    ↓
handleNavChange('Dashboard') in App.jsx
    ↓
setCurrentView('Dashboard')
    ↓
DashboardView component mounts
    ↓
DashboardView fetches its own data via useEffect:
  - /api/dashboard/category-sales
  - /api/dashboard/top-products
  - /api/dashboard/brand-sales
  - /api/dashboard/region-sales
  - /api/dashboard/payment-methods
  - /api/dashboard/sales-trends
    ↓
Charts render with fetched data
```

### 4. Search Flow

```
User types in search bar
    ↓
onChange event → Header.jsx
    ↓
onSearch() callback to App.jsx
    ↓
handleSearch(searchTerm)
    ↓
Update filters.search state
    ↓
API request with search parameter
    ↓
Backend filters by customerName or phoneNumber (regex)
    ↓
Table updates with search results
```

### 5. Pagination Flow

```
User clicks page number
    ↓
handlePageChange(newPage) in App.jsx
    ↓
Update filters.page state
    ↓
API request with new page parameter
    ↓
Backend returns paginated results
    ↓
Table updates with new page data
```

---

## Folder Structure

### Root Structure

```
TruEstate_Proj/
├── backend/                    # Backend API server
├── frontend/                   # React frontend application
├── docs/                       # Documentation (this file)
├── README.md                   # Project overview and setup
├── truestate_assignment_dataset.csv
└── truestate_assignment.pdf
```

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection configuration
│   ├── models/
│   │   └── Transaction.js     # Mongoose transaction schema
│   ├── routes/
│   │   └── api.js             # API route definitions
│   └── index.js               # Express app entry point
├── scripts/
│   └── importData.js          # CSV import utility
├── node_modules/              # Dependencies
├── .env                       # Environment variables
├── package.json               # Node.js dependencies & scripts
└── package-lock.json
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/            # React components
│   │   ├── BrandSalesChart.jsx
│   │   ├── CategorySalesChart.jsx
│   │   ├── Dashboard.jsx
│   │   ├── DashboardView.jsx
│   │   ├── FilterPanel.jsx
│   │   ├── Header.jsx
│   │   ├── PaymentMethodsChart.jsx
│   │   ├── RegionSalesChart.jsx
│   │   ├── SalesTrendsChart.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsRow.jsx
│   │   ├── TopProductsChart.jsx
│   │   └── TransactionTable.jsx
│   ├── services/
│   │   └── api.js             # API communication layer
│   ├── styles/
│   │   ├── index.css          # Global Tailwind styles
│   │   └── App.css            # Component styles
│   ├── assets/
│   │   └── react.svg          # Static assets
│   ├── App.jsx                # Main app component
│   └── main.jsx               # React entry point
├── public/                    # Static files
├── node_modules/              # Dependencies
├── index.html                 # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind CSS config
├── postcss.config.js          # PostCSS config
├── package.json               # Dependencies & scripts
└── package-lock.json
```

---

## Module Responsibilities

### Backend Modules

#### `src/index.js`

**Responsibility**: Application Bootstrap

- Initialize Express server
- Configure middleware
- Connect to database
- Register routes
- Start HTTP server

#### `src/config/db.js`

**Responsibility**: Database Connection Management

- Establish MongoDB connection
- Handle connection lifecycle
- Export connection utility

#### `src/models/Transaction.js`

**Responsibility**: Data Schema Definition

- Define transaction data structure
- Configure field types and validation
- Create database indexes
- Export Mongoose model

#### `src/routes/api.js`

**Responsibility**: API Endpoint Management

- Define RESTful routes
- Implement request handlers
- Build database queries from request parameters
- Execute aggregation pipelines
- Return formatted JSON responses
- Handle errors gracefully

#### `scripts/importData.js`

**Responsibility**: Data Import Utility

- Read CSV file
- Parse and transform data
- Batch insert into MongoDB
- Handle import errors

---

### Frontend Modules

#### `App.jsx`

**Responsibility**: Application State Management

- Manage global state (filters, pagination, data)
- Coordinate data fetching
- Handle user interactions (search, filter, page changes)
- Route between views (Dashboard/Services)
- Pass props to child components

#### Layout Components

**`Sidebar.jsx`**

- Navigation menu rendering
- View switching (Dashboard, Services, Invoices)
- Collapse/expand behavior
- Active state indication

**`Header.jsx`**

- Application title display
- Search input handling
- Search term propagation to parent

#### Dashboard Components

**`DashboardView.jsx`**

- Dashboard layout management
- Fetch dashboard-specific data
- Render chart grid
- Pass data to chart components

**Chart Components** (CategorySales, TopProducts, Brand, Region, PaymentMethods, SalesTrends)

- Fetch specific chart data
- Configure Recharts components
- Implement custom tooltips
- Handle loading and empty states
- Format currency and numbers

#### Data Components

**`FilterPanel.jsx`**

- Render multi-select dropdowns
- Render range inputs (age, date)
- Manage local dropdown states
- Emit filter changes to parent
- Implement clear filters functionality

**`StatsRow.jsx`**

- Display KPI cards
- Format large numbers (currency, quantities)
- Show aggregated statistics

**`TransactionTable.jsx`**

- Render data table with 13 columns
- Implement pagination controls
- Format dates and currency
- Display gender badges
- Handle loading states
- Highlight rows on hover

#### Service Layer

**`services/api.js`**

- Configure Axios instance
- Define API endpoints
- Serialize complex filters (arrays, objects) to query strings
- Handle HTTP requests and responses
- Export API methods for components

#### Styling

**`styles/index.css`**

- Tailwind CSS imports
- Global utility classes
- Custom CSS variables

**`styles/App.css`**

- Component-specific styles
- Override defaults as needed
