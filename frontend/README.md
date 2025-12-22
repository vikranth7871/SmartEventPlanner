# Smart Event Planner - Frontend

Angular 18 frontend application with Angular Material for the Smart Event Planner platform.

## 🚀 Quick Start

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Development Server**
   \`\`\`bash
   ng serve
   \`\`\`

3. **Open Browser**
   Navigate to `http://localhost:4200`

## 📁 Project Structure

\`\`\`
src/app/
├── components/
│   ├── auth/
│   │   ├── login.component.ts
│   │   └── register.component.ts
│   ├── events/
│   │   ├── event-list.component.ts
│   │   └── event-details.component.ts
│   ├── bookings/
│   │   ├── booking-confirmation.component.ts
│   │   └── user-bookings.component.ts
│   └── organizer/
│       ├── organizer-dashboard.component.ts
│       └── event-form.component.ts
├── services/
│   ├── auth.service.ts
│   ├── event.service.ts
│   └── booking.service.ts
├── guards/
│   ├── auth.guard.ts
│   └── organizer.guard.ts
├── models/
│   └── interfaces.ts
├── interceptors/
│   └── auth.interceptor.ts
├── app.component.ts
├── app.routes.ts
└── app.config.ts
\`\`\`

## 🎯 Features & Components

### Authentication Components
- **LoginComponent**: User login with email/password
- **RegisterComponent**: User registration with role selection

### Event Components
- **EventListComponent**: Browse and filter events
- **EventDetailsComponent**: View event details and book tickets

### Booking Components
- **BookingConfirmationComponent**: Display booking details and QR code
- **UserBookingsComponent**: List all user bookings

### Organizer Components
- **OrganizerDashboardComponent**: Manage events and view analytics
- **EventFormComponent**: Create and edit events

## 🔐 Authentication & Guards

### Auth Guard
Protects routes requiring authentication:
\`\`\`typescript
canActivate: [authGuard]
\`\`\`

### Organizer Guard
Restricts access to organizer/admin only:
\`\`\`typescript
canActivate: [authGuard, organizerGuard]
\`\`\`

### Auth Interceptor
Automatically adds JWT token to HTTP requests:
\`\`\`typescript
Authorization: Bearer <token>
\`\`\`

## 🛣️ Routing Configuration

| Path | Component | Guard | Description |
|------|-----------|-------|-------------|
| `/` | Redirect to `/events` | - | Home redirect |
| `/login` | LoginComponent | - | User login |
| `/register` | RegisterComponent | - | User registration |
| `/events` | EventListComponent | authGuard | Browse events |
| `/events/:id` | EventDetailsComponent | authGuard | Event details & booking |
| `/booking/:id` | BookingConfirmationComponent | authGuard | Booking confirmation |
| `/bookings` | UserBookingsComponent | authGuard | User's bookings |
| `/organizer/dashboard` | OrganizerDashboardComponent | authGuard, organizerGuard | Organizer dashboard |
| `/organizer/create-event` | EventFormComponent | authGuard, organizerGuard | Create event |
| `/organizer/edit-event/:id` | EventFormComponent | authGuard, organizerGuard | Edit event |

## 🎨 UI/UX Features

### Angular Material Components Used
- **MatToolbar**: Navigation bar
- **MatCard**: Content containers
- **MatButton**: Action buttons
- **MatFormField**: Form inputs
- **MatSelect**: Dropdown selections
- **MatDatepicker**: Date selection
- **MatSnackBar**: Notifications
- **MatTabs**: Tabbed content
- **MatMenu**: User menu

### Responsive Design
- Mobile-friendly navigation
- Flexible grid layouts
- Responsive form fields
- Adaptive card layouts

## 🔧 Services

### AuthService
- User authentication (login/register)
- JWT token management
- User session handling
- Role-based permissions

### EventService
- CRUD operations for events
- Event filtering and search
- Organizer event management

### BookingService
- Ticket booking creation
- Booking retrieval
- Event booking analytics

## 📱 Component Features

### Event List
- Search and filter functionality
- Category, date, and venue filters
- Responsive grid layout
- Real-time availability display

### Event Details
- Comprehensive event information
- Ticket booking form
- Price calculation
- Availability validation

### Booking Confirmation
- QR code display
- Booking details summary
- Navigation to user bookings

### Organizer Dashboard
- Event management interface
- Booking analytics
- Revenue tracking
- Attendee management

## 🎯 Form Validation

### Registration Form
- Email format validation
- Password strength requirements
- Required field validation
- Role selection

### Event Creation Form
- Required field validation
- Date/time validation
- Capacity minimum validation
- Price validation

### Booking Form
- Ticket quantity validation
- Availability checking
- Price calculation

## 🔄 State Management

### User State
- Current user information
- Authentication status
- Role-based permissions

### Event State
- Event listings
- Filter states
- Selected event details

### Booking State
- User bookings
- Booking confirmations
- QR code data

## 🎨 Styling & Theming

### Angular Material Theme
- Indigo-Pink theme
- Consistent color scheme
- Material Design principles

### Custom Styles
- Responsive layouts
- Custom spacing utilities
- Brand-specific styling

## 🧪 Development Commands

\`\`\`bash
# Development server
ng serve

# Build for production
ng build

# Run unit tests
ng test

# Run e2e tests
ng e2e

# Generate component
ng generate component component-name

# Generate service
ng generate service service-name

# Generate guard
ng generate guard guard-name
\`\`\`

## 🔧 Configuration

### Environment Configuration
\`\`\`typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
\`\`\`

### Angular Material Setup
\`\`\`typescript
// app.config.ts
providers: [
  provideAnimationsAsync(),
  importProvidersFrom(MatSnackBarModule)
]
\`\`\`

## 📈 Performance Optimizations

### Lazy Loading
- Route-based code splitting
- Component lazy loading
- Reduced initial bundle size

### OnPush Change Detection
- Optimized component updates
- Reduced change detection cycles

### Standalone Components
- Tree-shakable components
- Reduced bundle size
- Better performance

## 🚀 Build & Deployment

### Production Build
\`\`\`bash
ng build --configuration production
\`\`\`

### Build Optimization
- Ahead-of-Time (AOT) compilation
- Tree shaking
- Minification
- Bundle optimization

### Deployment Options
- Static hosting (Netlify, Vercel)
- CDN deployment
- Docker containerization
- Traditional web servers

## 🐛 Troubleshooting

### Common Issues

1. **Module Not Found**
   - Check import paths
   - Verify component exports
   - Clear node_modules and reinstall

2. **Authentication Issues**
   - Check token storage
   - Verify API endpoints
   - Clear browser storage

3. **Routing Problems**
   - Check route configuration
   - Verify guard implementations
   - Check component imports

4. **Material Design Issues**
   - Import required modules
   - Check theme configuration
   - Verify Angular Material version

## 🔄 Future Enhancements

- Progressive Web App (PWA) features
- Offline functionality
- Push notifications
- Advanced animations
- Internationalization (i18n)
- Accessibility improvements
- Performance monitoring