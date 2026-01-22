# Ceramyth Studio - E-Commerce Platform

A production-ready, scalable e-commerce platform for a ceramic art studio built with modern web technologies and clean code principles.

## 🏗️ Architecture

This project follows a **monorepo architecture** with clear separation of concerns:

```
ceramythstudio/
├── packages/
│   ├── backend/          # Express + TypeScript + PostgreSQL API
│   ├── frontend/         # React + TypeScript + Vite SPA
│   └── shared/           # Shared types and utilities
├── docker-compose.yml    # Multi-container Docker setup
└── package.json          # Root workspace configuration
```

## 🚀 Technology Stack

### Backend
- **Node.js** with **Express** - Fast, minimalist web framework
- **TypeScript** - Type safety and better DX
- **PostgreSQL** - Reliable relational database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe frontend code
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management

### DevOps
- **Docker & Docker Compose** - Containerization
- **ESLint & Prettier** - Code quality and formatting
- **npm workspaces** - Monorepo management

## 📁 Project Structure

### Backend Structure
```
packages/backend/src/
├── config/              # Configuration and database setup
├── controllers/         # Request handlers
├── middleware/          # Auth, error handling, etc.
├── routes/             # API route definitions
└── index.ts            # Application entry point
```

### Frontend Structure
```
packages/frontend/src/
├── components/         # Reusable UI components
├── context/           # React context providers
├── pages/             # Page components
├── services/          # API service layer
├── styles/            # CSS stylesheets
└── main.tsx           # Application entry point
```

### Shared Package
```
packages/shared/src/
└── types.ts           # Shared TypeScript interfaces and types
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose (for containerized deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ceramythstudio
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Backend (.env in packages/backend/):
```bash
cp packages/backend/.env.example packages/backend/.env
# Edit packages/backend/.env with your configuration
```

Frontend (.env in packages/frontend/):
```bash
cp packages/frontend/.env.example packages/frontend/.env
# Edit packages/frontend/.env with your configuration
```

4. **Start PostgreSQL** (using Docker or local installation)
```bash
docker run --name ceramyth-postgres -e POSTGRES_PASSWORD=ceramythpass -e POSTGRES_USER=ceramythuser -e POSTGRES_DB=ceramythstudio -p 5432:5432 -d postgres:15-alpine
```

5. **Build shared package**
```bash
cd packages/shared
npm install
npm run build
cd ../..
```

6. **Start development servers**
```bash
# Start both backend and frontend concurrently
npm run dev

# Or start individually:
npm run dev:backend    # Backend on http://localhost:3000
npm run dev:frontend   # Frontend on http://localhost:5173
```

## 🐳 Docker Deployment

Run the entire stack with Docker Compose:

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

This will start:
- PostgreSQL database on port 5432
- Backend API on port 3000
- Frontend app on port 5173

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Product Endpoints
- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart Endpoints (Protected)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item quantity
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints (Protected)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID

### Health Check
- `GET /api/health` - API health status

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both backend and frontend in development mode
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run format` - Format code with Prettier
- `npm run docker:up` - Start Docker services
- `npm run docker:down` - Stop Docker services

### Backend Package
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Start production server
- `npm run lint` - Lint backend code

### Frontend Package
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint frontend code

## 🎨 Features

### Implemented Features
✅ User authentication (register, login, JWT)
✅ Product catalog with categories and filtering
✅ Shopping cart management
✅ Order creation and management
✅ Responsive design
✅ Protected routes
✅ RESTful API
✅ Database migrations
✅ Docker containerization
✅ TypeScript throughout
✅ Clean architecture with separation of concerns

### Database Schema
- **Users** - User accounts with authentication
- **Products** - Product catalog with categories
- **Cart Items** - User shopping carts
- **Orders** - Order history and tracking
- **Order Items** - Items within orders

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected API routes
- Input validation with express-validator
- CORS configuration
- Helmet for security headers
- Environment variable configuration

## 🎯 Clean Code Principles Applied

1. **Separation of Concerns** - Clear separation between layers (routes, controllers, services)
2. **DRY (Don't Repeat Yourself)** - Shared types package, reusable components
3. **Single Responsibility** - Each module has one clear purpose
4. **Type Safety** - TypeScript throughout the stack
5. **Consistent Code Style** - ESLint and Prettier configuration
6. **Error Handling** - Centralized error handling middleware
7. **Environment Configuration** - Environment-based configuration
8. **API Design** - RESTful conventions, consistent response format

## 📝 Environment Variables

### Backend
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
```

### Frontend
```
VITE_API_URL=http://localhost:3000/api
```

## 🧪 Testing

Testing infrastructure can be added with:
- **Backend**: Jest + Supertest
- **Frontend**: Vitest + React Testing Library

## 📈 Scalability Considerations

- Monorepo structure allows independent scaling
- Stateless API design
- Database connection pooling
- Docker containerization for easy deployment
- Environment-based configuration
- Pagination for large datasets
- JWT for distributed authentication

## 🤝 Contributing

1. Follow the existing code style
2. Use TypeScript strict mode
3. Write descriptive commit messages
4. Test your changes locally
5. Update documentation as needed

## 📄 License

This project is proprietary and confidential.

## 👥 Contact

For questions or support, please contact the development team.