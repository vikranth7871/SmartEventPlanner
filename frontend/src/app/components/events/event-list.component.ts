import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { AuthService } from '../../services/auth.service';
import { Event } from '../../models/interfaces';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filterForm: FormGroup;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      date: [''],
      venue: ['']
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (response) => {
        this.events = response.events;
      },
      error: (error) => {
        this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    const cleanFilters: any = {};
    
    if (filters.category) cleanFilters.category = filters.category;
    if (filters.date) cleanFilters.date = this.formatDateForAPI(filters.date);
    if (filters.venue) cleanFilters.venue = filters.venue;

    this.eventService.getAllEvents(cleanFilters).subscribe({
      next: (response) => {
        this.events = response.events;
      },
      error: (error) => {
        this.snackBar.open('Failed to filter events', 'Close', { duration: 3000 });
      }
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.loadEvents();
  }

  viewEvent(eventId: number): void {
    this.router.navigate(['/events', eventId]);
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

  private formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}