# 🚀 JobTracker - Comprehensive Job Search & Preparation Platform

**JobTracker** is a powerful full-stack application designed to streamline the entire job search lifecycle. It bridges the gap between finding a job and preparing for it by offering listing discovery, application tracking, interview preparation, and performance analytics in a single, unified ecosystem.

![Project Banner](https://via.placeholder.com/1200x400?text=JobTracker+Dashboard)

## 🌟 Key Features

### 1. 🔍 Advanced Job Discovery
*   **Dynamic Usage:** Browse live job listings filtered by role, location, and company.
*   **Smart Recommendations:** Get personalized job suggestions based on your user profile and skills.
*   **Deep Search:** Efficiently search through thousands of opportunities.

### 2. 🗂️ Centralized Application Tracking
*   **Favorites System:** Bookmark jobs you are interested in.
*   **History Log:** Never lose track of where you've applied. Replace messy spreadsheets with an integrated tracking dashboard.

### 3. 🎓 Interview Preparation Hub
*   **Skill Quizzes:** Built-in quiz module covering key technical topics (JavaScript, React, Node.js, CS Fundamentals, etc.).
*   **Gamification:** Earn scores and track your progress on the global **Leaderboard**.
*   **Performance Analytics:** Visualize your strengths and weaknesses with detailed charts and statistics.

### 4. 📄 Smart CV Extractor
*   **Automated Parsing:** Upload your Resume/CV (PDF), and the system automatically extracts your details (Name, Email, Skills, Experience) to populate your profile.
*   **Seamless Onboarding:** Reduces repetitive form filling.

### 5. 💻 User-Centric Dashboard
*   **Profile Management:** Fully customizable user profiles.
*   **Theme Support:** Dynamic **Dark/Light Mode** for better accessibility.
*   **Responsive Design:** Optimized for Desktops, Tablets, and Mobile devices using **Ant Design**.

---

## 🛠️ Technology Stack

This project is built using the **MERN** stack:

*   **Frontend:**
    *   **React.js (Vite):** Fast, modern UI development.
    *   **Ant Design:** Professional, responsive component library.
    *   **Context API:** For state management (Auth, Theme).
    *   **Recharts:** For data visualization/analytics.

*   **Backend:**
    *   **Node.js & Express.js:** Robust RESTful API architecture.
    *   **PDF.js / Multer:** For handling file uploads and CV parsing.
    *   **JWT (JSON Web Tokens):** Secure user authentication and session management.

*   **Database:**
    *   **MongoDB:** NoSQL database for flexible data storage (Users, Jobs, Quiz Results).

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites
*   **Node.js** (v14 or higher)
*   **MongoDB** (Local instance or Atlas URL)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/jobtracker.git
cd jobtracker
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd job-tracker-backend
npm install
```

Create a `.env` file in `job-tracker-backend/` with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd job-tracker-frontend
npm install.
```

Start the frontend development server:
```bash
npm run dev
```

The application will launch at `http://localhost:5173`.

---

## 📂 Project Structure

```bash
jobtracker/
├── job-tracker-backend/   # Express.js Server & API
│   ├── controllers/       # Logic for Jobs, Users, Quiz
│   ├── models/            # Mongoose Schemas
│   ├── routes/            # API Routes
│   ├── middleware/        # Auth & Validations
│   └── uploads/           # Stored Resume/Image files
│
└── job-tracker-frontend/  # React Client
    ├── src/
    │   ├── components/    # Reusable UI Components
    │   ├── pages/         # Main Page Views (Dashboard, Home)
    │   ├── context/       # Auth & Theme Context
    │   └── assets/        # Static images/icons
    └── public/
```

---

## 🔮 Future Roadmap

*   [ ] **AI Resume Analysis:** AI-powered suggestions to improve CVs.
*   [ ] **Employer Portal:** Allow companies to post jobs directly.
*   [ ] **Community Forum:** A space for users to discuss interview experiences.
*   [ ] **Mobile App:** React Native version for iOS and Android.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and create a pull request for any features or bug fixes.

---

## 📄 License

This project is valid for personal and educational use.
