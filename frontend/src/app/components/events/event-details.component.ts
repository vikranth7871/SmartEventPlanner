import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/interfaces';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {
  event: Event | null = null;
  bookingForm: FormGroup;
  isBooking = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private bookingService: BookingService,
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      tickets_booked: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent(eventId);
  }

  loadEvent(eventId: number): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        this.event = response.event;
        this.bookingForm.get('tickets_booked')?.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.event.available_tickets || 0)
        ]);
      },
      error: (error) => {
        this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
        this.router.navigate(['/events']);
      }
    });
  }

  bookTickets(): void {
    if (this.bookingForm.valid && this.event) {
      this.isBooking = true;
      const bookingData = {
        event_id: this.event.id!,
        tickets_booked: this.bookingForm.get('tickets_booked')?.value
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.snackBar.open('Tickets booked successfully!', 'Close', { duration: 3000 });
          this.router.navigate(['/booking', response.booking.id]);
        },
        error: (error) => {
          this.snackBar.open(error.error?.error || 'Booking failed', 'Close', { duration: 3000 });
          this.isBooking = false;
        }
      });
    }
  }

  canBook(): boolean {
    return this.isAttendee() && !!this.event?.available_tickets;
  }

  isAttendee(): boolean {
    return this.authService.hasRole('attendee') || this.authService.hasRole('admin');
  }

  calculateTotal(): number {
    const tickets = this.bookingForm.get('tickets_booked')?.value || 0;
    return tickets * (this.event?.ticket_price || 0);
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

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}