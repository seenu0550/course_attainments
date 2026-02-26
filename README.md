# course_attainments

Course Attainment Management System

## Backend Setup (Step 1)

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (free at mongodb.com/cloud/atlas)

### Installation

```bash
cd backend
npm install
```

### Database Setup

1. Create free MongoDB Atlas cluster at https://mongodb.com/cloud/atlas
2. Get connection string
3. Configure environment:
```bash
cp .env.example .env
# Edit .env and paste your MongoDB URI
```

### Run Server

```bash
npm run dev
```

Server runs on http://localhost:5000