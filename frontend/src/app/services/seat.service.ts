import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeatService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getSeatLayout(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/seats`);
  }

  bookSeats(eventId: number, seatCodes: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/${eventId}/book-seats`, { seatCodes });
  }
}