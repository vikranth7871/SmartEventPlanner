export interface User {
  id: number;
  email: string;
  name: string;
  role: 'attendee' | 'organizer' | 'admin';
}

export interface Event {
  id?: number;
  organizer_id: number;
  name: string;
  description?: string;
  venue: string;
  date_time: Date | string;
  category: string;
  capacity: number;
  ticket_price?: number;
  image_url?: string;
  created_at?: Date;
  available_tickets?: number;
  seat_rows?: number;
  seat_cols?: number;
  has_seats?: boolean;
}

export interface Booking {
  id?: number;
  event_id: number;
  attendee_id: number;
  tickets_booked: number;
  total_price: number;
  qr_code?: string;
  booking_time?: Date;
  event_name?: string;
  event_venue?: string;
  event_date?: Date;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  error?: string;
}