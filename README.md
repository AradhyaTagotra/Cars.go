# Car Listing Website
 
A full-stack web application for browsing and searching car listings, with a secure admin panel for managing listings and their photos. Built with React, Node.js/Express and PostgreSQL, with car images stored on AWS S3.
 
> Project plan and scope: [IMPLEMENTATION.md](./IMPLEMENTATION.md)
 
## Features
 
- Browse and search car listings, each with a detail page and photo gallery
- Admin panel to add, edit and delete listings
- Image upload and delete for admins, with files stored on AWS S3
- Role-based access: **root** and **admin** accounts, backed by JWT authentication
- Request and application logging with timestamps and log levels
- Automated unit and integration tests with Jest and Supertest
- Pull-request workflow with a protected `main` branch and required code-owner review
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router |
| Backend | Node.js, Express (REST API) |
| Database | PostgreSQL (cloud-hosted) |
| File storage | AWS S3 |
| Authentication | JWT, bcrypt password hashing |
| Logging | Morgan (requests), Winston (application logs) |
| Testing | Jest, Supertest |
| Deployment | Ubuntu server, Nginx, PM2 |
 
## Roles and Access
 
| Role | Can do |
|---|---|
| Visitor | Browse and search listings |
| Admin | Everything a visitor can, plus add, edit and delete listings and images |
| Root | Everything an admin can, plus create admin accounts |
 
## Setup
 
1. Clone the repo:
```bash
git clone https://github.com/AradhyaTagotra/Cars.go.git
cd Cars.go
```
 
2. Start the backend:
```bash
cd backend
npm install
node index.js
```
 
   Before running it, create a `backend/.env` file with `DATABASE_URL`, `JWT_SECRET`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` and `AWS_S3_BUCKET`. The API runs on port 5000.
 
3. Start the frontend in a second terminal:
```bash
cd frontend
npm install
npm run dev
```
 
   The app opens at `http://localhost:5173` and forwards `/api` requests to the backend through the proxy in `vite.config.js`.
 
4. Run the backend tests:
```bash
cd backend
npm test
```
 
