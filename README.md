# Financial Analytics Dashboard

A full-stack financial analytics dashboard with authentication, transaction management, analytics, and CSV export.

**Tech stack:** React + TypeScript (frontend), Node.js + Express + MongoDB + JWT (backend), Ant Design UI.

## Features

- Secure login and JWT authentication
- Dashboard with metrics, charts, and recent transactions
- Advanced transaction table with filtering, sorting, search, and CSV export
- Responsive, modern dark UI (Ant Design)
- RESTful API with robust validation and error handling

## Project Structure

```
financial-dashboard/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── types/
│   │   └── app.ts
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── styles/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── index.html
└── data.json
```

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or Atlas)

## Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create a `.env` file in the backend/ directory:

```yaml
PORT=4000
MONGODB_URI=mongodb://localhost:27017/financial-dashboard
JWT_SECRET=your_jwt_secret_here
```

### Admin User Setup

Before running the app, you should create an initial admin user. This is done using the provided seed script.

#### How to Seed the Admin User

1. **Configure your backend `.env` file** (if you haven't already):

```yaml
MONGODB_URI=mongodb://localhost:27017/financial-dashboard
```

2. **Run the seed script from the backend directory:**

```bash
npm run seed
```

This will:
- Connect to your MongoDB database
- Remove all existing users (for a clean start)
- Create a new admin user with:
  - **Username:** `admin`
  - **Email:** `admin@example.com`
  - **Password:** `admin123`
  - **Role:** `admin`

### Start the backend server

For development (with auto-restart):

```bash
npm run dev
```

Or build and run:

```bash
npm run build
npm start
```

The backend API will be running at http://localhost:4000.

## Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Start the frontend dev server

```bash
npm run dev
```

The frontend will be running at http://localhost:5173.

## Usage

1. Register or seed a user (see backend seed script or use MongoDB Compass).
2. **Login as admin:**
- Go to http://localhost:5173
- Use:
  - **Username:** `admin`
  - **Password:** `admin123`
3. Explore the dashboard:
   - View metrics, charts, and transactions
   - Filter/search/export transactions
   - Download filtered CSVs

## API Endpoints

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| /api/auth/login | POST | Login, returns JWT | No |
| /api/transactions | GET | List transactions (filterable) | Yes |
| /api/export | POST | Export filtered transactions CSV | Yes |
| /api/dashboard | GET | Dashboard stats | Yes |

## Environment Variables

### Backend (backend/.env):

```yaml
PORT: 4000  # Port to run the backend (default: 4000)
MONGODB_URI: mongodb://localhost:27017/financial-dashboard  # MongoDB connection string
JWT_SECRET: your_jwt_secret_here  # Secret for JWT signing
```

### Frontend:

No special env needed for local dev (API is proxied or set in the service file).

## Postman Collection

Import the included postman_collection.json (if provided) or create your own:

- Login (POST /api/auth/login)
- Get Transactions (GET /api/transactions)
- Export CSV (POST /api/export with filters and fields, JWT in Authorization header)

## Common Issues

- **Cannot GET /api/export**: The export endpoint only supports POST requests.
- **"Access token required"**: Make sure you are logged in and sending the JWT in the Authorization header as Bearer <token>.
- **Frontend can't reach backend**: Make sure both servers are running and CORS is enabled in backend.

## Customization

- Add more transaction categories or statuses in /backend/src/models/Transaction.ts
- Change dashboard metrics or charts in /frontend/src/components/dashboard/

## License

MIT

Happy hacking!

For any issues, please open an issue or contact the maintainer.
