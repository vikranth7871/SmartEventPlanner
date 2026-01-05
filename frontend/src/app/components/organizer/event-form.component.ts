import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/interfaces';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule
  ],
  template: `
    <div class="event-form-container">
      <mat-card class="form-card">
        <mat-card-header>
          <mat-card-title>{{isEditMode ? 'Edit Event' : 'Create New Event'}}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="eventForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Event Name</mat-label>
                <input matInput formControlName="name" required>
                <mat-error *ngIf="eventForm.get('name')?.hasError('required')">
                  Event name is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3"></textarea>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Venue</mat-label>
                <input matInput formControlName="venue" required>
                <mat-error *ngIf="eventForm.get('venue')?.hasError('required')">
                  Venue is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Category</mat-label>
                <mat-select formControlName="category" required>
                  <mat-option value="Music">Music</mat-option>
                  <mat-option value="Workshop">Workshop</mat-option>
                  <mat-option value="Conference">Conference</mat-option>
                  <mat-option value="Sports">Sports</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
                <mat-error *ngIf="eventForm.get('category')?.hasError('required')">
                  Category is required
                </mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Date</mat-label>
                <input matInput [matDatepicker]="datePicker" formControlName="date" required>
                <mat-datepicker-toggle matSuffix [for]="datePicker"></mat-datepicker-toggle>
                <mat-datepicker #datePicker></mat-datepicker>
                <mat-error *ngIf="eventForm.get('date')?.hasError('required')">
                  Date is required
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Time</mat-label>
                <input matInput type="time" formControlName="time" required>
                <mat-error
                  *ngIf="
                    eventForm.get('time')?.hasError('required') &&
                    (eventForm.get('time')?.touched || eventForm.get('time')?.dirty)
                  "
                >
                  Time is required
                </mat-error>
              </mat-form-field>
            </div>


            <div class="form-row">
              <mat-checkbox formControlName="has_seats" (change)="onSeatModeChange($event)">
                Enable Seat-wise Booking
              </mat-checkbox>
            </div>

            <div class="form-row" *ngIf="eventForm.get('has_seats')?.value">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Number of Rows</mat-label>
                <input matInput type="number" formControlName="seat_rows" min="1" max="26">
                <mat-hint>Maximum 26 rows (A-Z)</mat-hint>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Seats per Row</mat-label>
                <input matInput type="number" formControlName="seat_cols" min="1" max="50">
              </mat-form-field>
            </div>

            <div class="form-row" *ngIf="eventForm.get('has_seats')?.value">
              <div class="capacity-info">
                <strong>Total Capacity: {{ calculateTotalCapacity() }}</strong>
                <small>This will override the manual capacity setting</small>
              </div>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width" *ngIf="!eventForm.get('has_seats')?.value">
                <mat-label>Capacity</mat-label>
                <input matInput type="number" formControlName="capacity" min="1" required>
                <mat-error *ngIf="eventForm.get('capacity')?.hasError('required')">
                  Capacity is required
                </mat-error>
                <mat-error *ngIf="eventForm.get('capacity')?.hasError('min')">
                  Capacity must be at least 1
                </mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" [class]="eventForm.get('has_seats')?.value ? 'full-width' : 'half-width'">
                <mat-label>Ticket Price ($)</mat-label>
                <input matInput type="number" formControlName="ticket_price" min="0" step="0.01">
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Image URL (Optional)</mat-label>
                <input matInput formControlName="image_url" type="url">
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-button type="button" (click)="cancel()">Cancel</button>
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="eventForm.invalid || isSubmitting">
                {{isSubmitting ? 'Saving...' : (isEditMode ? 'Update Event' : 'Create Event')}}
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .event-form-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .form-card {
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }
    .full-width {
      width: 100%;
    }
    .half-width {
      width: calc(50% - 8px);
    }
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 24px;
    }
    .capacity-info {
      padding: 16px;
      background: #f5f5f5;
      border-radius: 4px;
      width: 100%;
    }
    .capacity-info small {
      display: block;
      color: #666;
      margin-top: 4px;
    }
    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }
      .half-width {
        width: 100%;
      }
    }
  `]
})
export class EventFormComponent implements OnInit {
  eventForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  eventId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      venue: ['', Validators.required],
      category: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
      ticket_price: [0, [Validators.min(0)]],
      image_url: [''],
      has_seats: [false],
      seat_rows: [null],
      seat_cols: [null]
    });
  }

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.eventId) {
      this.isEditMode = true;
      this.loadEvent();
    }
  }

  loadEvent(): void {
    if (this.eventId) {
      this.eventService.getEventById(this.eventId).subscribe({
        next: (response) => {
          const event = response.event;
          const eventDate = new Date(event.date_time);
          
          this.eventForm.patchValue({
            name: event.name,
            description: event.description,
            venue: event.venue,
            category: event.category,
            date: eventDate,
            time: eventDate.toTimeString().slice(0, 5),
            capacity: event.capacity,
            ticket_price: event.ticket_price,
            image_url: event.image_url,
            has_seats: event.has_seats || false,
            seat_rows: event.seat_rows,
            seat_cols: event.seat_cols
          });
        },
        error: (error) => {
          this.snackBar.open('Failed to load event details', 'Close', { duration: 3000 });
          this.router.navigate(['/organizer/dashboard']);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      const formValue = this.eventForm.value;
      
      // Combine date and time
      const eventDateTime = new Date(formValue.date);
      const timeValue = formValue.time;
      
      if (timeValue && timeValue.includes(':')) {
        const [hours, minutes] = timeValue.split(':');
        eventDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      } else {
        // Default to current time if time is invalid
        const now = new Date();
        eventDateTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
      }

      const eventData = {
        name: formValue.name,
        description: formValue.description,
        venue: formValue.venue,
        category: formValue.category,
        date_time: eventDateTime.toISOString(),
        capacity: formValue.has_seats ? (formValue.seat_rows * formValue.seat_cols) : formValue.capacity,
        ticket_price: formValue.ticket_price,
        image_url: formValue.image_url,
        has_seats: formValue.has_seats,
        seat_rows: formValue.has_seats ? formValue.seat_rows : null,
        seat_cols: formValue.has_seats ? formValue.seat_cols : null
      };

      const operation = this.isEditMode 
        ? this.eventService.updateEvent(this.eventId!, eventData)
        : this.eventService.createEvent(eventData);

      operation.subscribe({
        next: (response) => {
          const message = this.isEditMode ? 'Event updated successfully!' : 'Event created successfully!';
          this.snackBar.open(message, 'Close', { duration: 3000 });
          this.router.navigate(['/organizer/dashboard']);
        },
        error: (error) => {
          const message = this.isEditMode ? 'Failed to update event' : 'Failed to create event';
          this.snackBar.open(error.error?.error || message, 'Close', { duration: 3000 });
          this.isSubmitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/organizer/dashboard']);
  }

  onSeatModeChange(event: any): void {
    const hasSeats = event.checked;
    if (hasSeats) {
      this.eventForm.get('seat_rows')?.setValidators([Validators.required, Validators.min(1), Validators.max(26)]);
      this.eventForm.get('seat_cols')?.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      this.eventForm.get('capacity')?.clearValidators();
    } else {
      this.eventForm.get('seat_rows')?.clearValidators();
      this.eventForm.get('seat_cols')?.clearValidators();
      this.eventForm.get('capacity')?.setValidators([Validators.required, Validators.min(1)]);
    }
    this.eventForm.get('seat_rows')?.updateValueAndValidity();
    this.eventForm.get('seat_cols')?.updateValueAndValidity();
    this.eventForm.get('capacity')?.updateValueAndValidity();
  }

  calculateTotalCapacity(): number {
    const rows = this.eventForm.get('seat_rows')?.value || 0;
    const cols = this.eventForm.get('seat_cols')?.value || 0;
    return rows * cols;
  }
}