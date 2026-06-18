# Streeks 🎯

A comprehensive habit and task tracking application designed to help you build streaks, maintain daily wins, and manage non-negotiables. Streeks combines powerful habit formation with task management to help you stay consistent and achieve your goals.

## 🌟 Features

- **Daily Win Tracking**: Track your daily accomplishments and maintain a winning streak
- **Non-Negotiables Management**: Define and monitor critical habits that are essential to your success
- **Task Management**: Organize and prioritize your tasks with status tracking
- **Streak Analytics**: Monitor your consistency with streak counting and weekly win rates
- **Weekly Summaries**: Get insights into your performance with automated weekly summaries
- **User Authentication**: Secure login and signup system
- **Real-time Dashboard**: View all your metrics in one beautiful dashboard

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org) (v16.2.7) - React 19.2.4
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Language**: TypeScript 5.x
- **Package Manager**: npm
- **Development**: ESLint for code quality

### Backend
- **Framework**: FastAPI (v0.136.3) - Python
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT tokens with Python-Jose
- **Security**: Bcrypt password hashing, Argon2, encryption
- **Server**: Uvicorn ASGI server
- **CORS Support**: Enabled for frontend integration

## 📁 Project Structure

```
Streeks/
├── frontend/                    # Next.js React application
│   ├── app/
│   │   ├── login/              # Login page
│   │   ├── signup/             # Signup page
│   │   ├── tasks/              # Tasks management page
│   │   ├── non-negotiables/    # Non-negotiables page
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   ├── services/               # API service calls
│   ├── public/                 # Static assets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                     # FastAPI Python application
│   ├── app/
│   │   ├── main.py             # FastAPI app initialization
│   │   ├── database.py         # Database connection & setup
│   │   ├── config.py           # Configuration
│   │   ├── routers/
│   │   │   ├── auth_router.py          # Authentication endpoints
│   │   │   ├── task_router.py          # Task management endpoints
│   │   │   └── non_negotiable_router.py# Non-negotiables endpoints
│   │   ├── models/             # SQLAlchemy database models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utility functions
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
└── run.sh                      # Script to run both servers
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+) and npm for the frontend
- **Python** (v3.8+) for the backend
- **PostgreSQL** database
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Ayushmanzzz/Streeks.git
cd Streeks
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with database configuration
cat > .env << EOF
DATABASE_URL=postgresql://user:password@localhost/streeks_db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF

# Run database migrations (if any)
# cd ..
```

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Running the Application

#### Option 1: Using the provided run.sh script
```bash
chmod +x run.sh
./run.sh
```

This will start both the backend and frontend servers.

#### Option 2: Run separately in different terminals

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application

- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

## 📚 API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login

### Non-Negotiables (`/non-negotiables`)
- `GET /non-negotiables/` - Get all non-negotiables
- `POST /non-negotiables/` - Create non-negotiable
- `GET /non-negotiables/{id}` - Get specific non-negotiable
- `PUT /non-negotiables/{id}` - Update non-negotiable
- `DELETE /non-negotiables/{id}` - Delete non-negotiable

### Tasks (`/tasks`)
- `GET /tasks/` - Get all tasks
- `POST /tasks/` - Create task
- `GET /tasks/{id}` - Get specific task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Dashboard (`/dashboard`)
- `GET /dashboard/` - Get dashboard data
- `GET /daily-win` - Check if daily win achieved
- `GET /daily-win-streak` - Get current streak
- `GET /weekly-summary` - Get weekly stats

## 🔐 Security Features

- JWT-based authentication
- Bcrypt password hashing
- CORS configuration for frontend access
- Secure token storage and validation
- Environment variables for sensitive data

## 📊 Key Concepts

### Daily Win
A daily win represents completing a significant achievement or milestone for the day. Track whether you've achieved your daily win.

### Non-Negotiables
Essential habits or systems that are critical to your success. These are daily commitments you must maintain.

### Streak
A consecutive count of days you've achieved your daily win. Build momentum by maintaining your streak!

### Weekly Summary
Automated insights into your performance over the week, including:
- Weekly win rate
- Active tasks count
- Overdue tasks count

## 📋 Development

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm build

# Start production server
npm start

# Lint code
npm run lint
```

### Backend Development
```bash
cd backend
source venv/bin/activate

# Run with reload
uvicorn app.main:app --reload

# Run with specific host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🗄️ Database

The application uses PostgreSQL with SQLAlchemy ORM. Connection string format:
```
postgresql://username:password@localhost:5432/streeks_db
```

Key tables include:
- **users** - User accounts and authentication
- **tasks** - Task items
- **non_negotiables** - Habit/non-negotiable items
- **daily_wins** - Daily achievement tracking
- **streaks** - Streak data

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

[Ayushmanzzz](https://github.com/Ayushmanzzz)

## 🙋 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

---

**Built with ❤️ to help you build better habits and achieve your goals.**
