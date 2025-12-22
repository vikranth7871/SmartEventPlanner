import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3001/api/events';

  constructor(private http: HttpClient) {}

  getAllEvents(filters?: { category?: string; date?: string; venue?: string }): Observable<{ events: Event[] }> {
    let params = new HttpParams();
    if (filters) {
      if (filters.category) params = params.set('category', filters.category);
      if (filters.date) params = params.set('date', filters.date);
      if (filters.venue) params = params.set('venue', filters.venue);
    }
    return this.http.get<{ events: Event[] }>(this.apiUrl, { params });
  }

  getEventById(id: number): Observable<{ event: Event }> {
    return this.http.get<{ event: Event }>(`${this.apiUrl}/${id}`);
  }

  getOrganizerEvents(): Observable<{ events: Event[] }> {
    return this.http.get<{ events: Event[] }>(`${this.apiUrl}/organizer`);
  }

  createEvent(event: Omit<Event, 'id' | 'organizer_id' | 'created_at'>): Observable<{ message: string; event: Event }> {
    return this.http.post<{ message: string; event: Event }>(this.apiUrl, event);
  }

  updateEvent(id: number, event: Partial<Event>): Observable<{ message: string; event: Event }> {
    return this.http.put<{ message: string; event: Event }>(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }
}