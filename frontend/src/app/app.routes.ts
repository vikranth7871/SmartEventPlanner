import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { organizerGuard } from './guards/organizer.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./components/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'events',
    canActivate: [authGuard],
    loadComponent: () => import('./components/events/event-list.component').then(m => m.EventListComponent)
  },
  {
    path: 'events/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/events/event-details.component').then(m => m.EventDetailsComponent)
  },
  {
    path: 'booking/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./components/bookings/booking-confirmation.component').then(m => m.BookingConfirmationComponent)
  },
  {
    path: 'bookings',
    canActivate: [authGuard],
    loadComponent: () => import('./components/bookings/user-bookings.component').then(m => m.UserBookingsComponent)
  },
  {
    path: 'organizer/dashboard',
    canActivate: [authGuard, organizerGuard],
    loadComponent: () => import('./components/organizer/organizer-dashboard.component').then(m => m.OrganizerDashboardComponent)
  },
  {
    path: 'organizer/create-event',
    canActivate: [authGuard, organizerGuard],
    loadComponent: () => import('./components/organizer/event-form.component').then(m => m.EventFormComponent)
  },
  {
    path: 'organizer/edit-event/:id',
    canActivate: [authGuard, organizerGuard],
    loadComponent: () => import('./components/organizer/event-form.component').then(m => m.EventFormComponent)
  },
  { path: '**', redirectTo: '/home' }
];