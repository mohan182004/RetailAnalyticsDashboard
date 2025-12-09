# TruEstate Frontend

React-based dashboard for TruEstate Retail Analytics with interactive charts and data visualization.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## Features

- **Dashboard View**: Analytics charts including category sales, top products, brand analysis, regional sales, payment methods, and sales trends
- **Services View**: Comprehensive transaction table with advanced filtering
- **Multi-Select Filters**: Customer region, gender, product category, payment method, tags
- **Range Filters**: Age range, date range
- **Search**: Real-time search by customer name or phone number
- **Pagination**: Navigate through large datasets efficiently
- **Responsive Design**: Optimized for various screen sizes

## Project Structure

```
frontend/
├── src/
│   ├── components/      # React components (charts, tables, filters)
│   ├── services/        # API communication layer
│   ├── styles/          # CSS files
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main application component
│   └── main.jsx         # React entry point
├── public/              # Static files
└── index.html           # HTML template
```

## Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Date Handling**: Date-fns, React Datepicker

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Configuration

The frontend connects to the backend API at `http://localhost:5000` by default. This can be configured in `src/services/api.js`.
