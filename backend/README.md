# CivicLink Backend API

A comprehensive backend API for the CivicLink civic engagement platform, providing authentication, fact-checking, translations, and community management features.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Management**: Voter, organizer, and ambassador roles
- **Fact-Checking System**: Submit, review, and verify claims with traffic light system
- **Translation Assistant**: Multilingual civic terms with audio support
- **Organizer Dashboard**: Analytics, claim management, and content library
- **Ambassador Toolkit**: Gamified platform with leaderboards and training
- **Help & Support**: FAQ, SMS shortcodes, and contact system

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **CORS** for cross-origin requests
- **Rate Limiting** for API protection

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp config.example.env .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/civiclink
   JWT_SECRET=your-super-secret-jwt-key-here
   FRONTEND_URL=http://localhost:8080
   ```

4. **Start the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Claims (Fact-Checking)
- `GET /api/claims` - Get all claims with filtering
- `GET /api/claims/trending` - Get trending claims
- `GET /api/claims/:id` - Get single claim
- `POST /api/claims` - Submit new claim
- `PUT /api/claims/:id/review` - Review claim (organizers)
- `POST /api/claims/:id/feedback` - Submit feedback
- `POST /api/claims/:id/share` - Track sharing

### Translations
- `GET /api/translations` - Get translations with search
- `GET /api/translations/categories` - Get categories
- `GET /api/translations/:id` - Get single translation
- `POST /api/translations` - Create translation (organizers)
- `PUT /api/translations/:id/verify` - Verify translation
- `POST /api/translations/:id/feedback` - Submit feedback
- `GET /api/translations/stats/overview` - Get statistics

### Organizers
- `GET /api/organizers/dashboard` - Get dashboard data
- `GET /api/organizers/claims` - Get claims for review
- `GET /api/organizers/content-library` - Get content library
- `GET /api/organizers/analytics` - Get analytics data

### Ambassadors
- `GET /api/ambassadors/toolkit` - Get toolkit data
- `POST /api/ambassadors/content/download` - Track download
- `POST /api/ambassadors/invite` - Send invitations
- `POST /api/ambassadors/support-request` - Submit support request

### Users
- `GET /api/users/ambassadors/leaderboard` - Get leaderboard
- `PUT /api/users/ambassadors/points` - Update points (organizers)
- `PUT /api/users/training-progress` - Update training progress
- `PUT /api/users/preferences` - Update preferences

### Help
- `GET /api/help/faq` - Get FAQ data
- `GET /api/help/sms-shortcodes` - Get SMS shortcodes
- `GET /api/help/languages` - Get supported languages
- `GET /api/help/polling-location` - Get polling location
- `POST /api/help/contact` - Submit contact form

## Database Models

### User
- Authentication and profile information
- Role-based permissions (voter, organizer, ambassador, admin)
- Preferences and accessibility settings
- Training progress and ambassador points

### Claim
- Fact-checking claims with status tracking
- Verdict system (true, false, misleading, unverified)
- Source citations and reviewer information
- Community and language categorization

### Translation
- Multilingual civic terms
- Audio support and verification status
- Usage tracking and feedback system
- Category and difficulty classification

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Input Validation**: Express-validator for all inputs
- **Rate Limiting**: Prevent API abuse
- **CORS Protection**: Configured for frontend domain
- **Helmet Security**: Security headers
- **Role-based Access**: Granular permission system

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/civiclink |
| `JWT_SECRET` | JWT signing secret | Required |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:8080 |
| `EMAIL_HOST` | SMTP host for emails | Optional |
| `EMAIL_USER` | SMTP username | Optional |
| `EMAIL_PASS` | SMTP password | Optional |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | Optional |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | Optional |

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── config/          # Database and app configuration
├── middleware/      # Custom middleware (auth, validation)
├── models/          # MongoDB models
├── routes/          # API route handlers
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

### Adding New Features

1. **Create Model**: Define MongoDB schema in `models/`
2. **Create Routes**: Add API endpoints in `routes/`
3. **Add Middleware**: Create custom middleware if needed
4. **Update Server**: Register new routes in `server.js`
5. **Test**: Add tests for new functionality

## Deployment

### Production Setup

1. **Set environment variables** for production
2. **Use MongoDB Atlas** for database
3. **Configure reverse proxy** (nginx)
4. **Set up SSL certificates**
5. **Use PM2** for process management

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details



