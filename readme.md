# 🧠 DocChat — Chat With Your Documents

A full-stack AI application that lets users upload documents and chat with an intelligent assistant.

## 🚀 Overview

DocChat allows users to upload PDFs or text files and ask questions about their content.
The system extracts text, processes it with an AI model, and returns accurate answers with context.

Built with a modern stack:

 - ⚛️ React + TypeScript + Vite

 - 🎨 Tailwind CSS & TanStack Query

 - 🐍 Django backend (REST API)

 - 🗄️ PostgreSQL database

 - 🔐 Supabase Authentication

 - ☁️ Deployed on Vercel (frontend) & AWS EC2 (backend)

## 🛠️ Features
### 🔹 Document Upload

 - Upload PDFs or text documents.

 - Django extracts and stores the text in Postgres.

### 🔹 Chat with AI

 - Ask questions based on uploaded documents.

 - Backend sends relevant content to the LLM.

 - Returns accurate, context-aware responses.

### 🔹 User Accounts

 - Login/Signup using Supabase Auth.

 - JWTs are passed to Django for authentication.

### 🔹 Free & Paid Plans (Upcoming)

 - Free users → limited uploads + limited chats

 - Paid users → higher file size limit + extended usage

 - Payment provider: Stripe/Razorpay (TBD)

## 📦 Tech Stack
### Frontend

 - React

 - TypeScript

 - Vite

 - TanStack Query

 - Tailwind CSS

### Backend

 - Django

 - Django REST Framework

 - PostgreSQL


### Authentication

 - Supabase Auth

 - JWT verification in Django

### Hosting

 - Vercel (client)

 - AWS EC2 (server)

 - Nginx + Certbot for SSL

## 🔧 Installation & Setup
### 1. Clone the repo
```
git clone https://github.com/your-username/docchat.git
```

### 2. Frontend Setup
```
cd client
npm install
npm run dev
```

Set up environment variables:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=https://docchat.api.yugansharora.com
```

### 3. Backend Setup
```
cd server
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Environment variables:
Frontend :-
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_SERVER_URL=
```
Backend :-
```
SUPABASE_URL=
GROQ_API_KEY=
LLM_PROVIDER=
DATABASE_URL=
ALLOWED_HOSTS=
CORS_ALLOWED_ORIGINS=
CSRF_ALLOWED_ORIGINS=
DEBUG=
SECRET_KEY=
SUPABASE_JWT_SECRET=
HF_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_STORAGE_BUCKET_NAME=
```

## 📁 Folder Structure
```
docchat/
 ├── client/          # React frontend
 ├── server/          # Django backend
 └── README.md
 ```

## 🛣️ Roadmap

 - Add user subscription plans

 - Add chat history export

 - Add multi-document support

 - Implement rate limiting for free tier

 - Add analytics dashboard for users

## 🤝 Contributing

PRs and suggestions are welcome!

## 📄 License

MIT License.