# Class Quiz Hub Backend

A robust backend API for managing student data with Excel file upload functionality.

## Features

- **Excel File Processing**: Upload and process .xlsx, .xls, and .csv files
- **Student Management**: CRUD operations for student data
- **Flexible Data Storage**: Support for multiple worksheets and custom data fields
- **Authentication**: JWT-based admin authentication
- **File Upload**: Secure file handling with validation
- **Database**: SQLite database with proper schema design
- **API Documentation**: RESTful API with validation

## Quick Start

### 1. Installation

```bash
cd server
npm install
```

### 2. Environment Setup

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:
- Change `JWT_SECRET` to a secure random string
- Modify admin credentials if needed
- Adjust file upload limits as required

### 3. Initialize Database

```bash
npm run init-db
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### File Upload

- `POST /api/upload/excel` - Upload Excel file (Admin only)
- `GET /api/upload/history` - Get upload history (Admin only)
- `GET /api/upload/worksheets` - Get all worksheets (Admin only)

### Students

- `GET /api/students` - Get all students
- `GET /api/students/number/:studentNumber` - Get student by number
- `GET /api/students/search?q=query` - Search students
- `POST /api/students` - Create student (Admin only)
- `PUT /api/students/:id` - Update student (Admin only)
- `GET /api/students/:id/data` - Get student data

### Health Check

- `GET /api/health` - Server health status

## Excel File Format

The system expects Excel files with the following structure:

### Required Columns
- **Student Number** (or Student_Number, ID, Student ID)
- **Name** (or Student Name, Full Name)

### Optional Columns
- **Section** (or Class, Group)
- Any additional data columns (grades, attendance, etc.)

### Example Excel Structure

| Student Number | Name | Section | Midterm | Final | Quiz 1 |
|----------------|------|---------|---------|-------|--------|
| STU001 | John Doe | A | 85 | 90 | 88 |
| STU002 | Jane Smith | B | 92 | 87 | 95 |

## Database Schema

### Tables

1. **students** - Basic student information
2. **worksheets** - Uploaded worksheet metadata
3. **student_data** - Flexible key-value storage for student data
4. **upload_history** - Track file uploads
5. **admin_users** - Admin user accounts

## Security Features

- JWT authentication for admin endpoints
- File type validation (Excel/CSV only)
- File size limits (configurable)
- Rate limiting
- Helmet.js security headers
- Input validation and sanitization

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details (development only)"
}
```

## Development

### Project Structure

```
server/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── upload.js            # File upload middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── upload.js            # File upload routes
│   └── students.js          # Student management routes
├── services/
│   └── excelProcessor.js    # Excel file processing logic
├── scripts/
│   └── initDatabase.js      # Database initialization
├── uploads/                 # Temporary file storage
├── database/                # SQLite database files
├── .env                     # Environment variables
├── .env.example             # Environment template
├── package.json
└── server.js                # Main server file
```

### Adding New Features

1. Create new routes in the `routes/` directory
2. Add middleware in the `middleware/` directory
3. Implement business logic in the `services/` directory
4. Update database schema in `config/database.js`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up reverse proxy (nginx)
5. Use process manager (PM2)
6. Set up SSL/TLS certificates
7. Configure database backups

## Troubleshooting

### Common Issues

1. **File upload fails**: Check file size limits and file type
2. **Database errors**: Ensure database directory is writable
3. **Authentication fails**: Verify JWT_SECRET and token format
4. **CORS errors**: Check origin configuration in production

### Logs

The server logs important events to the console. In production, consider using a logging service.

## License

MIT License