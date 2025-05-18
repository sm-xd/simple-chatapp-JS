# 💬 Simple Chat App Boilerplate

A minimal full-stack chat application built using **React (Vite)** on the frontend and **Node.js (Express)** on the backend. This project is designed to be easily integrated into any application to enable real-time chat functionality.

## ✨ Features

- One-to-one chat support
- Real-time messaging via WebSockets (Socket.IO)
- Scalable React + Vite frontend
- Node.js + Express backend API
- Modular code structure for reuse
- Mobile responsive UI

## 🛠️ Tech Stack

**Frontend:**
- React + Vite
- Tailwind CSS *(optional)*
- Socket.IO client

**Backend:**
- Node.js
- Express
- Socket.IO server
- MongoDB + Mongoose *(optional)*

## 📁 Folder Structure

```
chat-app/
├── frontend/              # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── main.jsx
│   └── vite.config.js
├── backend/              # Backend (Node + Express)
│   ├── index.js
│   ├── socket.js
│   └── routes/
├── package.json          # Root (optional scripts)
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sm-xd/simple-chatapp-JS.git
cd chat-app-boilerplate
```

### 2. Install Dependencies

**Frontend:**

```bash
cd frontend
npm install
```

**Backend:**

```bash
cd ../backend
npm install
```

### 3. Run the App

**Start the backend server:**

```bash
npm run dev
```

**Start the frontend (in another terminal):**

```bash
cd ../frontend
npm run dev
```

Now open `http://localhost:5173` to view the app.

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

> MongoDB is optional if you're not storing messages.

## 🔌 Integration Steps

To use this chat feature in another app:

1. Copy the `frontend/` and `backend/` folders into your target project.
2. Wire up the chat components with your existing auth system (for usernames/user IDs).
3. Adjust styles and logic as needed for your use case.

## 📦 Build for Production

**Frontend:**

```bash
cd frontend
npm run build
```

**Backend:**

Set up your backend to serve `frontend/dist` or deploy separately using platforms like:
- **Frontend:** Vercel, Netlify
- **Backend:** Render, Railway, Heroku


## 🙌 Contributing

Pull requests are welcome! If you'd like to improve or extend this boilerplate, feel free to fork and submit changes.
