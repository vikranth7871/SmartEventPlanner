import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3001/api/bookings';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: { event_id: number; tickets_booked: number }): Observable<{ message: string; booking: Booking }> {
    return this.http.post<{ message: string; booking: Booking }>(this.apiUrl, bookingData);
  }

  getBookingById(id: number): Observable<{ booking: Booking }> {
    return this.http.get<{ booking: Booking }>(`${this.apiUrl}/${id}`);
  }

  getUserBookings(): Observable<{ bookings: Booking[] }> {
    return this.http.get<{ bookings: Booking[] }>(`${this.apiUrl}/user`);
  }

  getEventBookings(eventId: number): Observable<{ bookings: Booking[]; stats: any }> {
    return this.http.get<{ bookings: Booking[]; stats: any }>(`${this.apiUrl}/event/${eventId}`);
  }

  getOrganizerStats(): Observable<{ stats: any }> {
    return this.http.get<{ stats: any }>(`${this.apiUrl}/organizer/stats`);
  }
}