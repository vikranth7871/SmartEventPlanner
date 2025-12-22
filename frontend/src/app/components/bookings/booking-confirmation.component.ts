import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../models/interfaces';

@Component({
  selector: 'app-booking-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})
export class BookingConfirmationComponent implements OnInit {
  booking: Booking | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const bookingId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadBooking(bookingId);
  }

  loadBooking(bookingId: number): void {
    this.bookingService.getBookingById(bookingId).subscribe({
      next: (response) => {
        this.booking = response.booking;
      },
      error: (error) => {
        this.error = 'Failed to load booking details. Please check your booking ID.';
        this.snackBar.open('Failed to load booking details', 'Close', { duration: 3000 });
      }
    });
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

  viewMyBookings(): void {
    this.router.navigate(['/bookings']);
  }

  backToEvents(): void {
    this.router.navigate(['/events']);
  }
}