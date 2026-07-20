# 🧠 SynapseAI – Enterprise AI Workspace

SynapseAI is a full-stack **AI-powered Enterprise Workspace** designed to bring project management, team collaboration, task tracking, document intelligence, meeting insights, and AI-powered productivity tools into one unified platform.

The platform combines a modern React-based workspace with a FastAPI backend, MongoDB database, secure JWT authentication, and Generative AI capabilities.

---

## 🌐 Live Application

🚀 **Try SynapseAI:**  
(https://synapseai.ai.studio/)

> The live application is currently published through Google AI Studio.

---

## ✨ Key Features

### 🔐 Authentication & Security
- Secure user registration and login
- JWT-based authentication
- Protected backend API routes
- Authenticated API requests
- User profile management

### 📊 Intelligent Dashboard
- Today's Overview
- Active projects
- Task progress
- Team information
- Activity stream
- Smart notifications
- Quick actions

### 📁 Project Management
- Create and manage projects
- Edit and delete projects
- Search projects
- Track project information
- Attach project files

### 👥 Team Management
- Create and manage teams
- Add and remove team members
- Update team information
- Organize project collaboration

### ✅ Task Management
- Create and manage tasks
- Assign tasks to users
- Update task status
- Priority-based task management
- Task search and filtering
- Kanban-style task visualization

### 📚 Document Library
- Upload enterprise documents
- Access uploaded files
- AI-powered document summarization
- Document knowledge management

### 🤖 AI Assistant
- AI-powered enterprise assistance
- Context-aware interactions
- Intelligent knowledge retrieval
- AI conversation history

### 🧠 AI-Powered Productivity
- Project summaries
- Document summaries
- Daily summaries
- Smart reminders
- Tomorrow planning
- Team recommendations
- Intelligent notifications

### 🎙️ Meeting Intelligence
- Generate AI meeting minutes
- Extract action items
- Convert meeting discussions into tasks
- Meeting productivity assistance

### 💬 Collaboration
- Team communication interface
- AI chat history
- Workspace messaging
- Meetings and calls interface

### 🎨 Modern User Experience
- Clean enterprise SaaS interface
- Responsive design
- Light mode by default
- Dark mode support
- Collapsible navigation
- Premium glass-style components

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────┐
│       React + Vite + TypeScript     │
│             Frontend                │
└──────────────────┬──────────────────┘
                   │
                   │ REST API / Axios
                   │ JWT Bearer Token
                   ▼
┌─────────────────────────────────────┐
│             FastAPI                 │
│              Backend                │
├─────────────────────────────────────┤
│ Authentication │ Projects │ Teams   │
│ Tasks │ Documents │ AI Services     │
└──────────────┬───────────┬──────────┘
               │           │
               ▼           ▼
       ┌─────────────┐  ┌─────────────┐
       │   MongoDB   │  │  Gemini AI  │
       │    Atlas    │  │     API     │
       └─────────────┘  └─────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- TypeScript
- Axios
- Modern responsive UI

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic
- JWT Authentication

### Database
- MongoDB
- MongoDB Atlas
- PyMongo

### Artificial Intelligence
- Google Gemini API
- Retrieval-Augmented Generation (RAG)
- AI Document Summarization
- Meeting Intelligence
- AI Recommendations

---

## 📂 Project Structure

```text
synapse-ai/
│
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pranathii15/synapse-ai.git
cd synapse-ai
```

### 2. Start the Backend

```bash
cd backend

python -m venv venv
```

Activate the virtual environment on Windows:

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn app.main:app --reload
```

The backend will run locally on port `8000`.

API documentation is available through the FastAPI `/docs` endpoint.

---

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Configuration

Create a `.env` file inside the backend directory.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=your_gemini_api_key
```

Create a `.env` file inside the frontend directory.

```env
VITE_API_URL=http://localhost:8000
```

> Never commit real API keys, JWT secrets, passwords, or database credentials to GitHub.

---

## 🔌 Main API Modules

The FastAPI backend provides APIs for:

- Authentication
- User Profiles
- Projects
- Teams
- Tasks
- Document Upload
- AI Document Summaries
- Project Summaries
- Meeting Intelligence
- Team Recommendations
- Daily Summaries
- Smart Reminders
- Tomorrow Planning
- Smart Notifications
- AI Chat History

Interactive API documentation is available through Swagger UI when the backend is running.

---

## 📸 Application Screenshots

Screenshots can be added here for:

- Public Landing Page
- Dashboard
- Projects
- Teams
- Tasks
- Document Library
- Ask AI
- Meeting Intelligence
- AI Recommendations

---

## 🚀 Future Enhancements

- Real-time WebSocket team messaging
- Production-ready video and voice calling
- Advanced role-based access control
- Multi-organization workspaces
- Calendar integration
- Email notifications
- Slack and Microsoft Teams integrations
- Advanced enterprise RAG pipelines
- Cloud-based vector database
- AI workflow automation

---

## 👩‍💻 Developer

**Pranathi M**

Computer Science Undergraduate  
Backend Developer | AI/ML | Data & Full-Stack Development

---

## 📌 Project Status

🚧 **Active Development**

SynapseAI is continuously being improved with additional enterprise collaboration and AI-powered productivity features.

---

## ⭐ Support

If you find SynapseAI interesting, consider starring the repository!
