# Aurelle

Aurelle is a luxury perfume e-commerce store built with the MERN stack for the Devixo Solutions Summer Internship, Task 04.

## Live Demo

- **Frontend:** https://aurelle-store-sigma.vercel.app
- **Backend API:** [View products API](https://aurelle-backend-seven.vercel.app/api/products)

## Features

### Authentication

- Register, log in, and log out.
- JWT authentication with tokens that expire after one day.
- Passwords must be at least six characters and include a letter and a number.
- Protected routes for signed-in users.

### Shopping

- Browse products with search, category and price filters, sorting, and pagination.
- View product details, use the cart drawer, and check out with mock payment.
- Review past purchases on the My Orders page.

### Roles and Admin

- The first registered user becomes an admin. Later registrations are customer accounts.
- Admin dashboard with revenue, order, product, and user stats, a low stock list, and recent orders.
- Admins can add, edit, and delete products, and update order statuses.

### UI and Motion

- Responsive layouts for phones, tablets, and desktops.
- Intro animation, custom cursor, scroll progress bar, and marquee.
- Framer Motion page and interface transitions.
- Featured Fragrances story cards that expand on interaction.
- Product card hover videos where the cap opens and the perfume sprays.
- A scroll storytelling section powered by GSAP ScrollTrigger.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios, Framer Motion, GSAP, Lenis
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs
- **Deployment:** Vercel

## Project Structure

```text
backend/
  middleware/       Authentication and role checks
  models/           User, product, and order models
  routes/           Auth, product, order, and stats endpoints
  seed.js           Product seed script
  server.js         Express app and API setup
frontend/
  public/           Product images and videos
  src/
    components/     Shared UI and motion components
    context/        Authentication and cart state
    pages/          Shop, product, checkout, orders, and admin pages
    api.js          Axios API client
    App.jsx         Routes and app layout
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/sadafiqbal91/ecommerce-store.git
cd ecommerce-store
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `backend/.env` file with your own values:

```env
PORT=5000
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<your JWT signing secret>
```

Seed the product catalog, then start the backend:

```bash
npm run seed
npm run dev
```

The API will be available at `http://localhost:5000/api`.

### 3. Set up the frontend

In another terminal, from the project root:

```bash
cd frontend
npm install
```

The frontend uses `http://localhost:5000/api` by default. To use another API URL, optionally create `frontend/.env`:

```env
VITE_API_URL=<your API base URL>
```

Start the frontend:

```bash
npm run dev
```

## API Overview

Endpoints below include the `/api` prefix.

| Endpoint | Method | Access |
|---|---|---|
| `/api/auth/register` | `POST` | Public |
| `/api/auth/login` | `POST` | Public |
| `/api/auth/me` | `GET` | User |
| `/api/products` | `GET` | Public |
| `/api/products` | `POST` | Admin |
| `/api/products/:id` | `PUT`, `DELETE` | Admin |
| `/api/orders` | `POST` | User |
| `/api/orders` | `GET` | Admin |
| `/api/orders/mine` | `GET` | User |
| `/api/orders/:id/status` | `PUT` | Admin |
| `/api/stats` | `GET` | Admin |

Product listing supports search, category, price range, sorting, and pagination query parameters.

## Demo Accounts

- **Admin demo:** `admin@store.com` / `admin123` (demo only)
- Any new user can register as a normal customer. The first registered user in a new database becomes the admin.

The seed script adds products only. It does not create the demo account.

## Security Notes

- Passwords are hashed with bcryptjs before storage.
- JWTs authenticate requests, and protected routes require a valid token.
- Admin-only routes check the user's role.
- The server checks product prices and stock when an order is placed.
- Keep secrets in environment variables. `.env` files are not committed.

## Author

**Sadaf Iqbal**  
Devixo Solutions Summer Internship
