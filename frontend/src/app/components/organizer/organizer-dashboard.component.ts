import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { Event, Booking } from '../../models/interfaces';

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css']
})
export class OrganizerDashboardComponent implements OnInit {
  events: Event[] = [];
  selectedEventBookings: Booking[] = [];
  selectedEventName = '';
  eventStats: any = null;
  organizerStats: any = null;

  constructor(
    private eventService: EventService,
    private bookingService: BookingService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadOrganizerStats();
  }

  loadOrganizerStats(): void {
    console.log('Loading organizer stats...');
    this.bookingService.getOrganizerStats().subscribe({
      next: (response) => {
        console.log('Organizer stats response:', response);
        this.organizerStats = response.stats;
      },
      error: (error) => {
        console.error('Failed to load organizer stats:', error);
        this.snackBar.open('Failed to load analytics', 'Close', { duration: 3000 });
      }
    });
  }

  loadEvents(): void {
    this.eventService.getOrganizerEvents().subscribe({
      next: (response) => {
        this.events = response.events;
      },
      error: (error) => {
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/organizer/create-event']);
  }

  editEvent(eventId: number): void {
    this.router.navigate(['/organizer/edit-event', eventId]);
  }

  deleteEvent(eventId: number, eventName: string): void {
    if (confirm(`Are you sure you want to delete "${eventName}"? This action cannot be undone.`)) {
      this.eventService.deleteEvent(eventId).subscribe({
        next: () => {
          this.snackBar.open('Event deleted successfully', 'Close', { duration: 3000 });
          this.loadEvents();
        },
        error: (error) => {
          this.snackBar.open('Failed to delete event', 'Close', { duration: 3000 });
        }
      });
    }
  }

  viewEventBookings(eventId: number): void {
    const event = this.events.find(e => e.id === eventId);
    this.selectedEventName = event?.name || '';
    
    this.bookingService.getEventBookings(eventId).subscribe({
      next: (response) => {
        this.selectedEventBookings = response.bookings;
        this.eventStats = response.stats;
        // Refresh overall organizer stats when viewing event bookings
        this.loadOrganizerStats();
      },
      error: (error) => {
        this.snackBar.open('Failed to load event bookings', 'Close', { duration: 3000 });
      }
    });
  }

  clearBookingsView(): void {
    this.selectedEventBookings = [];
    this.selectedEventName = '';
    this.eventStats = null;
  }

  getAttendeeName(booking: any): string {
    return booking.attendee_name || 'Unknown';
  }

  getAttendeeEmail(booking: any): string {
    return booking.attendee_email || 'Unknown';
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}