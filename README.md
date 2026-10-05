# Job Application Tracker

A small, clean, production-quality personal application to track software job applications.

## Features
- Dashboard with application statistics
- Add, View, Edit, Delete job applications
- Search by company name
- Filter by status
- Responsive UI

## Tech Stack
- **Frontend:** React.js, Vite, Axios, React Router
- **Backend:** Python, FastAPI, SQLAlchemy, MySQL, Pydantic

## Folder Structure
```text
job-application-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── crud.py
│   │   └── routers/
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    ├── package.json
    └── vite.config.js
```

## Setup Instructions

### Database
1. Install MySQL and make sure it is running.
2. Create a database named `job_tracker`.

### Backend
1. Navigate to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Copy `.env.example` to `.env` and set your MySQL credentials.
6. Run the server: `uvicorn app.main:app --reload` (Runs on port 8000)

### Frontend
1. Navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev` (Runs on port 5173 by default)

## API Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/applications` - List applications
- `POST /api/applications` - Create application
- `GET /api/applications/{id}` - Get single application
- `PUT /api/applications/{id}` - Update application
- `DELETE /api/applications/{id}` - Delete application

## Screenshots
<img width="1920" height="1080" alt="Screenshot (286)" src="https://github.com/user-attachments/assets/ea8ea645-0711-40a2-838d-874074808410" />


## Future Improvements
- Pagination for the applications table
- Export applications to CSV
- Dark mode
