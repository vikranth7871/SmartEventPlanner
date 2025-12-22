# Smart Event Planner - Backend

Node.js + TypeScript + Express + MySQL backend for the Smart Event Planner application.

## 🚀 Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your database credentials
   \`\`\`

3. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## 📁 Project Structure

\`\`\`
src/
├── config/
│   └── database.ts          # Database connection & initialization
├── controllers/
│   ├── authController.ts    # Authentication logic
│   ├── eventController.ts   # Event CRUD operations
│   └── bookingController.ts # Booking management
├── models/
│   ├── User.ts             # User model & methods
│   ├── Event.ts            # Event model & methods
│   └── Booking.ts          # Booking model & methods
├── routes/
│   ├── auth.ts             # Authentication routes
│   ├── events.ts           # Event routes
│   └── bookings.ts         # Booking routes
├── middleware/
│   └── auth.ts             # JWT authentication middleware
├── utils/
│   └── validation.ts       # Joi validation schemas
└── server.ts               # Main server file
\`\`\`

## 🔧 Environment Variables

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smart_event_planner
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
\`\`\`

## 📊 API Documentation

### Authentication Endpoints

#### Register User
\`\`\`http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "attendee" // or "organizer"
}
\`\`\`

#### Login User
\`\`\`http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
\`\`\`

### Event Endpoints

#### Get All Events
\`\`\`http
GET /api/events
Authorization: Bearer <token>

# Optional query parameters:
# ?category=Music&date=2024-01-01&venue=Stadium
\`\`\`

#### Create Event (Organizer/Admin only)
\`\`\`http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Music Concert",
  "description": "Amazing live music event",
  "venue": "City Stadium",
  "date_time": "2024-12-25T19:00:00Z",
  "category": "Music",
  "capacity": 1000,
  "ticket_price": 50.00,
  "image_url": "https://example.com/image.jpg"
}
\`\`\`

### Booking Endpoints

#### Create Booking (Attendee only)
\`\`\`http
POST /api/bookings
Authorization: Bearer <token>
Content-Type: application/json

{
  "event_id": 1,
  "tickets_booked": 2
}
\`\`\`

#### Get User Bookings
\`\`\`http
GET /api/bookings/user
Authorization: Bearer <token>
\`\`\`

## 🔐 Authentication & Authorization

- **JWT Tokens**: Used for stateless authentication
- **Role-based Access**: Different permissions for attendee/organizer/admin
- **Password Hashing**: bcryptjs with salt rounds
- **Token Expiration**: 24 hours (configurable)

## 🛡️ Security Features

- Input validation with Joi schemas
- SQL injection prevention with parameterized queries
- CORS protection
- Password hashing
- JWT token verification
- Role-based route protection

## 📝 Database Models

### User Model Methods
- \`create(userData)\` - Create new user
- \`findByEmail(email)\` - Find user by email
- \`findById(id)\` - Find user by ID
- \`validatePassword(password, hash)\` - Verify password
- \`generateToken(user)\` - Generate JWT token

### Event Model Methods
- \`create(eventData)\` - Create new event
- \`findAll()\` - Get all events with available tickets
- \`findById(id)\` - Get event by ID
- \`findByOrganizer(organizerId)\` - Get organizer's events
- \`update(id, data)\` - Update event
- \`delete(id)\` - Delete event
- \`searchEvents(filters)\` - Search with filters

### Booking Model Methods
- \`create(bookingData)\` - Create booking with QR code
- \`findById(id)\` - Get booking by ID
- \`findByAttendee(attendeeId)\` - Get user's bookings
- \`findByEvent(eventId)\` - Get event bookings
- \`getEventStats(eventId)\` - Get booking statistics

## 🔄 Error Handling

- Centralized error handling middleware
- Proper HTTP status codes
- Detailed error messages for development
- Generic error messages for production
- Request validation errors
- Database operation errors

## 🧪 Testing

\`\`\`bash
# Run tests (when implemented)
npm test

# Test with curl examples
curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"attendee"}'
\`\`\`

## 📈 Performance Considerations

- Connection pooling for MySQL
- Efficient database queries with JOINs
- Proper indexing on foreign keys
- Pagination for large datasets (can be added)
- Caching strategies (can be implemented)

## 🚀 Deployment

### Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Setup
- Set production database credentials
- Use strong JWT secret
- Configure proper CORS origins
- Set up SSL/HTTPS
- Configure logging

### Docker (Optional)
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 🔧 Development Tips

1. **Database Reset**: Drop and recreate database for fresh start
2. **Logging**: Add console.log statements for debugging
3. **Postman**: Use for API testing during development
4. **MySQL Workbench**: Visual database management
5. **Nodemon**: Automatic server restart on file changes