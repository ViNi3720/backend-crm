# CRM Backend

REST API for a simple CRM system built with Node.js, Express, PostgreSQL and JWT.

## Features

- Employee register and login with JWT
- Public enquiry form API (no authentication)
- Claim a lead (a claimed lead becomes private to that employee)
- Fetch unclaimed leads
- Fetch leads claimed by the logged-in employee

## Tech Stack

Node.js, Express, PostgreSQL, JSON Web Token, bcryptjs

## Setup

1. Clone the repository

```bash
git clone https://github.com/<username>/crm-backend.git
cd crm-backend
```

2. Install dependencies

```bash
npm install
```

3. Create the database

```sql
CREATE DATABASE crm_db;
```

4. Create the tables

```bash
psql -U postgres -d crm_db -f sql/schema.sql
```

5. Create a `.env` file by copying `.env.example` and fill in your values

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=crm_db
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d
```

6. Start the server

```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint           | Auth | Description                                 |
| ------ | ------------------ | ---- | ------------------------------------------- |
| POST   | `/auth/register`   | No   | Register a new employee                     |
| POST   | `/auth/login`      | No   | Login and receive a JWT                     |
| POST   | `/leads`           | No   | Submit a public enquiry                     |
| GET    | `/leads/unclaimed` | Yes  | Get all unclaimed leads                     |
| PATCH  | `/leads/:id/claim` | Yes  | Claim a lead                                |
| GET    | `/leads/my`        | Yes  | Get leads claimed by the logged-in employee |

Protected routes need this header:

```
Authorization: Bearer <token>
```

## Request Bodies

Register:

```json
{ "name": "Vishal", "email": "vishal@gmail.com", "password": "123456" }
```

Login:

```json
{ "email": "vishal@gmail.com", "password": "123456" }
```

Public enquiry:

```json
{ "name": "Rahul", "email": "rahul@gmail.com", "course_interest": "Full Stack" }
```

## Notes

- Passwords are hashed with bcrypt.
- Claiming uses a single atomic SQL update, so a lead can be claimed by only one employee even with concurrent requests.
- A lead that is already claimed returns `409`.
