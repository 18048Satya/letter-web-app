# Letter App - Google Drive Integration

A full-stack web application that allows users to create and save letters directly to their Google Drive.

## Features

- Google Authentication
- Text-based letter creation and editing
- Direct saving to Google Drive
- Draft saving functionality
- Modern, responsive UI

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: Google OAuth
- Storage: Google Drive API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Google Cloud Platform account with OAuth 2.0 credentials
- Google Drive API enabled

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Backend
MONGODB_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables
4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start frontend server
   cd ../frontend
   npm start
   ```

## Project Structure

```
letter-app/
├── backend/           # Express backend
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   └── middleware/   # Custom middleware
├── frontend/         # React frontend
│   ├── public/       # Static files
│   └── src/          # React source code
└── README.md
```

## API Endpoints

- `POST /api/auth/google` - Google OAuth login
- `GET /api/auth/google/callback` - Google OAuth callback
- `POST /api/letters` - Create a new letter
- `GET /api/letters` - Get all letters for the user
- `PUT /api/letters/:id` - Update a letter
- `DELETE /api/letters/:id` - Delete a letter
- `POST /api/letters/:id/save-to-drive` - Save letter to Google Drive

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 