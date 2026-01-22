# Quick Setup Guide - Ceramyth Studio

This guide will help you get the Ceramyth Studio e-commerce platform running locally in under 5 minutes.

## Prerequisites Check
```bash
node --version  # Should be >= 18.0.0
npm --version   # Should be >= 9.0.0
docker --version  # Optional, for containerized deployment
```

## Quick Start (Local Development)

### Step 1: Install Dependencies
```bash
cd /path/to/Ceramythstudio-
npm install
```

### Step 2: Build Shared Package
```bash
cd packages/shared
npm install
npm run build
cd ../..
```

### Step 3: Set Up Environment Variables

**Backend:**
```bash
cd packages/backend
cp .env.example .env
# Edit .env and update DATABASE_URL if needed
```

**Frontend:**
```bash
cd packages/frontend
cp .env.example .env
# Default settings should work for local development
cd ../..
```

### Step 4: Start PostgreSQL Database

**Option A: Using Docker (Recommended)**
```bash
docker run --name ceramyth-postgres \
  -e POSTGRES_PASSWORD=ceramythpass \
  -e POSTGRES_USER=ceramythuser \
  -e POSTGRES_DB=ceramythstudio \
  -p 5432:5432 \
  -d postgres:15-alpine
```

**Option B: Using Existing PostgreSQL**
Update the `DATABASE_URL` in `packages/backend/.env` with your connection string.

### Step 5: Start the Application
```bash
npm run dev
```

This will start:
- **Backend API** at http://localhost:3000
- **Frontend App** at http://localhost:5173

### Step 6: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:5173
- **API Health Check**: http://localhost:3000/api/health

## Quick Start (Docker - Entire Stack)

If you have Docker and Docker Compose installed:

```bash
npm run docker:up
```

This starts everything (database, backend, frontend) in containers.

To stop:
```bash
npm run docker:down
```

## First-Time Setup Tasks

1. **Register an Admin User** (Manual Database Entry)
   After registering a regular user, you can promote them to admin:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Add Sample Products**
   Use the API endpoints or create products through the admin interface once logged in as an admin.

## Testing the Setup

### Test Backend API
```bash
# Health check
curl http://localhost:3000/api/health

# Register a user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Frontend
1. Open http://localhost:5173
2. Click "Register" and create an account
3. Browse the products page
4. Add items to cart (after login)

## Common Issues

### Port Already in Use
- Backend (3000): Change `PORT` in `packages/backend/.env`
- Frontend (5173): Change port in `packages/frontend/vite.config.ts`
- PostgreSQL (5432): Change the port mapping in docker command

### Database Connection Failed
- Ensure PostgreSQL is running: `docker ps` (if using Docker)
- Check `DATABASE_URL` in `packages/backend/.env`
- Verify PostgreSQL credentials

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules packages/*/node_modules
npm install
```

### Shared Package Not Found
```bash
cd packages/shared
npm install
npm run build
cd ../..
```

## Development Workflow

### Making Backend Changes
```bash
# Backend runs with hot-reload
cd packages/backend
npm run dev
```

### Making Frontend Changes
```bash
# Frontend runs with hot-reload via Vite
cd packages/frontend
npm run dev
```

### Code Quality
```bash
# Run linter
npm run lint

# Format code
npm run format
```

## Next Steps

1. **Explore the API**: Check `README.md` for full API documentation
2. **Add Products**: Create products through the admin API
3. **Customize**: Modify styles, add features, extend functionality
4. **Deploy**: Use Docker Compose for production deployment

## Need Help?

- Check the main `README.md` for detailed documentation
- Review the code comments in source files
- Check environment variable configurations

## Project Structure Quick Reference
```
ceramythstudio/
├── packages/
│   ├── backend/          # Node.js + Express + PostgreSQL
│   ├── frontend/         # React + TypeScript + Vite
│   └── shared/           # Shared TypeScript types
├── docker-compose.yml    # Docker orchestration
└── package.json          # Root workspace config
```

Happy coding! 🚀
