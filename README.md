
<div align="center">

# IntiForage

### AI-Powered Career, Job Application & Interview Platform

A full-stack career preparation platform designed to help students and job seekers analyze resumes, understand job requirements, identify skill gaps, track applications, and prepare for technical and behavioral interviews.

[![Live Demo](https://img.shields.io/badge/Live-Demo-2563EB?style=for-the-badge&logo=vercel&logoColor=white)](https://inti-forage.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Jitesh3103/IntiForage)

</div>

---

## Overview

IntiForage is a full-stack career platform developed to simplify the job-search and interview preparation process.

The platform brings multiple career development tools into one application, allowing users to analyze their resumes, evaluate job descriptions, identify missing skills, manage job applications, and practice different types of interview questions.

It combines resume analysis, job analysis, skill-gap identification, application tracking, and AI-powered interview preparation in a unified platform.

## Features

### Authentication & User Management
- User registration and login.
- JWT-based authentication.
- Secure access to protected application routes.
- User-specific resume and application data.

### Resume Analyzer
- Upload and analyze resumes.
- Extract relevant resume information.
- Identify skills and resume-related details.
- Provide an overall resume assessment.

### Job Description Analyzer
- Analyze job descriptions.
- Identify required skills and qualifications.
- Extract relevant job keywords.
- Understand job-specific requirements.

### Skill Gap Analysis
- Compare existing candidate skills with job requirements.
- Identify missing skills.
- Highlight areas requiring improvement.

### Job Application Tracker
- Organize job applications.
- Track application information.
- Maintain user-specific application records.

### Interview & Practice Preparation

IntiForage provides multiple preparation categories:

- Aptitude Practice
- Coding Questions
- Technical Theory Questions
- Resume-Based Interview Questions
- Company Interview Round
- Manager Interview Round
- HR / Behavioral Interview Round

### AI-Powered Question Generation
- Generate interview and practice questions using AI.
- Support different interview preparation categories.
- Provide personalized preparation based on user information.

---

## Technology Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- JavaScript
- HTML5
- CSS3
- Vite

### Backend
- Node.js
- Express.js
- RESTful APIs
- JWT Authentication
- Multer
- PDF Processing

### Database
- PostgreSQL

### Artificial Intelligence
- OpenAI API

### Tools & Deployment
- Git
- GitHub
- Visual Studio Code
- Vercel
- Render

---

## Project Architecture

IntiForage follows a client-server architecture with separate frontend and backend applications.

```text
                 IntiForage
                     |
          +----------+----------+
          |                     |
       Frontend              Backend
          |                     |
       React.js             Node.js
       Vite                 Express.js
       React Router         REST APIs
       Tailwind CSS         JWT Authentication
          |                     |
          |                  PostgreSQL
          |                     |
          +----------+----------+
                     |
                OpenAI API
```

---

## Project Structure

```text
IntiForage/
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── scripts/
│   │   └── utils/
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Installation & Setup

Follow these steps to run the project locally.

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Jitesh3103/IntiForage.git
```

```bash
cd IntiForage
```

### 2. Setup Frontend

```bash
cd client
npm install
```

Start the frontend using the development script configured in `client/package.json`.

### 3. Setup Backend

Open another terminal:

```bash
cd server
npm install
```

Configure the required environment variables before starting the backend.

Start the backend using the script configured in `server/package.json`.

### 4. Database Configuration

- Create a PostgreSQL database.
- Configure the database connection using the backend environment variables.
- Ensure the database is accessible to the backend application.

### 5. Environment Configuration

Add the required environment variables in the appropriate frontend and backend environment files.

Do not commit API keys, database credentials, JWT secrets, or other sensitive configuration values.

---

## Deployment

IntiForage is deployed as a full-stack application.

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | PostgreSQL hosted through Render |

### Live Application

**https://inti-forage.vercel.app**

---

## Future Scope

- Further improvements to AI-powered career assistance.
- Enhanced interview preparation capabilities.
- Additional resume and job analysis improvements.
- Expanded career development features.

---

## Author

**Naik Jitesh Mahabaleshwar**

Computer Science Engineering (Data Science) Graduate | Full-Stack Developer

- Portfolio: https://jitesh3103.github.io/jitesh-portfolio/
- LinkedIn: https://www.linkedin.com/in/naik-jitesh-mahabaleshwar/
- GitHub: https://github.com/Jitesh3103
- Email: naikjiteshm@gmail.com

---

<div align="center">

**IntiForage – Simplifying Career Preparation Through Technology.**

</div>
