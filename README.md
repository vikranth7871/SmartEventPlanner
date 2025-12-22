# Smart Event Planner & Ticketing Platform

A full-stack web application for event creation, promotion, and ticket booking with QR code confirmation.

## 🚀 Features

### User Roles
- **Attendee**: Browse events, book tickets, view booking confirmations with QR codes
- **Organizer**: Create and manage events, track ticket sales, view attendee analytics
- **Admin**: Oversee all events, users, and generate analytics

### Core Functionality
- **Event Management**: Create, update, delete events with detailed information
- **Ticket Booking**: Secure booking system with capacity validation
- **QR Code Generation**: Automatic QR code generation for ticket verification
- **Search & Filter**: Filter events by category, date, and venue
- **Analytics Dashboard**: Track bookings, revenue, and attendee data
- **Role-based Access Control**: Secure routes with Angular guards

## 🛠 Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** framework
- **MySQL** database
- **JWT** authentication
- **bcryptjs** for password hashing
- **QRCode** library for ticket generation
- **Joi** for validation

### Frontend
- **Angular 18** with standalone components
- **Angular Material** for UI components
- **TypeScript**
- **RxJS** for reactive programming
- **Angular Guards** for route protection

## 📋 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone <repository-url>
cd SmartEventPlanner
\`\`\`

### 2. Backend Setup

\`\`\`bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=smart_event_planner
# JWT_SECRET=your-super-secret-jwt-key

# Build the project
npm run build

# Start the server
npm run dev
\`\`\`

The backend server will start on `http://localhost:3000`

### 3. Frontend Setup

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start the development server
ng serve
\`\`\`

The frontend application will be available at `http://localhost:4200`

### 4. Database Setup

The application will automatically create the required database and tables on first run. Ensure MySQL is running and the credentials in `.env` are correct.

## 📊 Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `role` (attendee/organizer/admin)
- `created_at`

### Events Table
- `id` (Primary Key)
- `organizer_id` (Foreign Key → Users)
- `name`
- `description`
- `venue`
- `date_time`
- `category`
- `capacity`
- `ticket_price`
- `image_url`
- `created_at`

### Bookings Table
- `id` (Primary Key)
- `event_id` (Foreign Key → Events)
- `attendee_id` (Foreign Key → Users)
- `tickets_booked`
- `total_price`
- `qr_code`
- `booking_time`

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events (with filters)
- `GET /api/events/:id` - Get event by ID
- `GET /api/events/organizer` - Get organizer's events
- `POST /api/events` - Create new event (Organizer/Admin)
- `PUT /api/events/:id` - Update event (Organizer/Admin)
- `DELETE /api/events/:id` - Delete event (Organizer/Admin)

### Bookings
- `POST /api/bookings` - Create booking (Attendee)
- `GET /api/bookings/user` - Get user's bookings
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/event/:eventId` - Get event bookings (Organizer/Admin)

## 🎯 Usage

### For Attendees
1. Register/Login as an attendee
2. Browse available events
3. Filter events by category, date, or venue
4. View event details and book tickets
5. View booking confirmation with QR code
6. Access all bookings from "My Bookings"

### For Organizers
1. Register/Login as an organizer
2. Access the Organizer Dashboard
3. Create new events with detailed information
4. Manage existing events (edit/delete)
5. View booking analytics and attendee lists
6. Track revenue and ticket sales

### For Admins
- Full access to all features
- Can manage any event or booking
- Access to comprehensive analytics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation with Joi
- SQL injection prevention
- CORS protection

## 🎨 UI/UX Features

- Responsive design with Angular Material
- Clean and intuitive interface
- Real-time form validation
- Loading states and error handling
- Snackbar notifications
- Mobile-friendly navigation

## 🚦 Development Scripts

### Backend
\`\`\`bash
npm run dev      # Start development server with nodemon
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
\`\`\`

### Frontend
\`\`\`bash
ng serve         # Start development server
ng build         # Build for production
ng test          # Run unit tests
\`\`\`

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure MySQL is running
   - Check database credentials in `.env`
   - Verify database exists or let the app create it

2. **Port Already in Use**
   - Backend: Change PORT in `.env`
   - Frontend: Use `ng serve --port 4201`

3. **CORS Issues**
   - Ensure backend CORS is configured for frontend URL
   - Check if both servers are running

4. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in `.env`
   - Verify token expiration

## 📝 Future Enhancements

- Email notifications for bookings
- Payment gateway integration
- Event image upload functionality
- Advanced analytics and reporting
- Mobile app development
- Social media integration
- Event recommendations
- Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions, please create an issue in the repository or contact the development team.