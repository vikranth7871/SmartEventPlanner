import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Seat {
  id: number;
  seat_code: string;
  is_booked: boolean;
  seat_type: 'normal' | 'vip';
  price: number;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seat-layout">
      <div class="screen">SCREEN</div>
      
      <div class="seats-container">
        <div *ngFor="let row of seatLayout | keyvalue" class="seat-row">
          <div class="row-label">{{ row.key }}</div>
          <div class="seats">
            <div 
              *ngFor="let seat of row.value" 
              class="seat"
              [class.booked]="seat.is_booked"
              [class.selected]="isSelected(seat.seat_code)"
              [class.vip]="seat.seat_type === 'vip'"
              (click)="toggleSeat(seat)"
              [attr.title]="seat.seat_code + ' - $' + seat.price">
              {{ seat.seat_code }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="legend">
        <div class="legend-item">
          <div class="seat available"></div>
          <span>Available</span>
        </div>
        <div class="legend-item">
          <div class="seat selected"></div>
          <span>Selected</span>
        </div>
        <div class="legend-item">
          <div class="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>
      
      <div class="selection-summary" *ngIf="selectedSeats.length > 0">
        <h3>Selected Seats: {{ selectedSeats.join(', ') }}</h3>
        <p>Total: ${{ totalPrice }}</p>
      </div>
    </div>
  `,
  styles: [`
    .seat-layout {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .screen {
      background: #333;
      color: white;
      text-align: center;
      padding: 10px;
      margin-bottom: 30px;
      border-radius: 20px;
    }
    
    .seat-row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .row-label {
      width: 30px;
      font-weight: bold;
      text-align: center;
    }
    
    .seats {
      display: flex;
      gap: 5px;
    }
    
    .seat {
      width: 35px;
      height: 35px;
      border: 2px solid #ddd;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 10px;
      font-weight: bold;
      background: #f9f9f9;
      transition: all 0.2s;
    }
    
    .seat:hover:not(.booked) {
      border-color: #007bff;
      transform: scale(1.1);
    }
    
    .seat.selected {
      background: #007bff;
      color: white;
      border-color: #0056b3;
    }
    
    .seat.booked {
      background: #dc3545;
      color: white;
      cursor: not-allowed;
      border-color: #c82333;
    }
    
    .seat.vip {
      background: #ffd700;
      border-color: #ffcd00;
    }
    
    .legend {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .legend .seat {
      width: 20px;
      height: 20px;
      cursor: default;
    }
    
    .selection-summary {
      text-align: center;
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
  `]
})
export class SeatSelectionComponent implements OnInit {
  @Input() eventId!: number;
  @Input() seatLayout: { [row: string]: Seat[] } = {};
  @Output() seatsSelected = new EventEmitter<string[]>();
  
  selectedSeats: string[] = [];
  totalPrice: number = 0;
  
  ngOnInit() {
    // Component initialization
  }
  
  toggleSeat(seat: Seat) {
    if (seat.is_booked) return;
    
    const index = this.selectedSeats.indexOf(seat.seat_code);
    if (index > -1) {
      this.selectedSeats.splice(index, 1);
      this.totalPrice -= seat.price;
    } else {
      this.selectedSeats.push(seat.seat_code);
      this.totalPrice += seat.price;
    }
    
    this.seatsSelected.emit(this.selectedSeats);
  }
  
  isSelected(seatCode: string): boolean {
    return this.selectedSeats.includes(seatCode);
  }
}