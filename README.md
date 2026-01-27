# AmbuCheck - Ambulance Equipment Compliance Checklist App

A web application for checking vehicle equipment in ambulances for compliance. The app includes admin and user login features, runsheet management, and comprehensive equipment check forms.

## Features

- **Authentication System**
  - Admin login with admin features
  - User login with PIN requirement
  - JWT-based authentication

- **Runsheet Management**
  - View list of runsheets with pagination
  - Search functionality
  - Display shift details (date, times, trust, callsign)

- **Equipment Check Form**
  - 8 comprehensive sections covering all vehicle equipment
  - Photo upload functionality (front, nearside, rear, offside)
  - Real-time form validation
  - PIN requirement for crew members

## Project Structure

```
Checklist App/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   └── App.js
│   └── package.json
├── server/                # Node.js/Express backend
│   ├── data/             # JSON data storage
│   ├── uploads/          # Uploaded photos
│   ├── index.js
│   └── package.json
└── package.json
```

## Installation

1. Install root dependencies:
```bash
npm install
```

2. Install server dependencies:
```bash
cd server
npm install
cd ..
```

3. Install client dependencies:
```bash
cd client
npm install
cd ..
```

## Running the Application

### Development Mode (runs both server and client)

From the root directory:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Running Separately

**Backend only:**
```bash
cd server
npm start
```

**Frontend only:**
```bash
cd client
npm start
```

## Default Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`
- PIN: Not required

**User:**
- Username: `markkelly`
- Password: `user123`
- PIN: Any value (required)

## API Endpoints

- `POST /api/login` - User authentication
- `GET /api/me` - Get current user
- `GET /api/runsheets` - Get runsheets (with pagination and search)
- `GET /api/runsheets/:id` - Get single runsheet
- `POST /api/equipment-checks` - Submit equipment check
- `POST /api/upload/:fieldName` - Upload photo
- `GET /api/admin/users` - Get all users (admin only)

## Equipment Check Sections

1. **Start Shift** - Vehicle registration, mileage, fuel, fuel card
2. **Section 1** - Vehicle Lighting/Fluids
3. **Section 2** - Emergency Lighting/Sirens
4. **Section 3** - Medical Gases
5. **Section 4** - Cockpit Checks
6. **Section 5** - Patient Area
7. **Section 6** - Patient Equipment
8. **Section 7** - Photos/Comments
9. **Section 8** - Staff Information

## Technologies Used

- **Frontend:** React, React Router, Axios
- **Backend:** Node.js, Express, JWT, bcryptjs, Multer
- **Storage:** JSON files (can be easily migrated to a database)

## Notes

- Data is stored in JSON files in the `server/data/` directory
- Uploaded photos are stored in `server/uploads/`
- The app uses JWT tokens for authentication (stored in localStorage)
- All form fields marked with * are required

## Future Enhancements

- Database integration (PostgreSQL/MySQL)
- Admin dashboard for managing users and runsheets
- Equipment check history and reports
- Email notifications
- Mobile-responsive improvements


