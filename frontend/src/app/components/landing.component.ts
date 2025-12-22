import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, MatIconModule],
  template: `
    <div class="landing-container">
      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-content">
          <h1>Smart Event Planner</h1>
          <p class="hero-subtitle">Your Complete Event Management & Ticketing Solution</p>
          <p class="hero-description">Create, promote, and manage events with ease. Book tickets securely with QR code confirmation.</p>
          <div class="hero-buttons">
            <button mat-raised-button color="primary" routerLink="/events" class="cta-button">
              Browse Events
            </button>
            <button mat-stroked-button routerLink="/register" class="secondary-button">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features">
        <div class="container">
          <h2>Why Choose Smart Event Planner?</h2>
          <div class="features-grid">
            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">event</mat-icon>
                <h3>Event Management</h3>
                <p>Create and manage events with detailed information, capacity control, and real-time updates.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">confirmation_number</mat-icon>
                <h3>Secure Ticketing</h3>
                <p>Book tickets securely with automatic QR code generation for easy verification at events.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">analytics</mat-icon>
                <h3>Analytics Dashboard</h3>
                <p>Track bookings, revenue, and attendee data with comprehensive analytics and reporting.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">search</mat-icon>
                <h3>Smart Search</h3>
                <p>Find events easily with advanced filtering by category, date, venue, and more.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">security</mat-icon>
                <h3>Role-Based Access</h3>
                <p>Secure platform with different access levels for attendees, organizers, and administrators.</p>
              </mat-card-content>
            </mat-card>

            <mat-card class="feature-card">
              <mat-card-content>
                <mat-icon class="feature-icon">qr_code</mat-icon>
                <h3>QR Code Verification</h3>
                <p>Instant ticket verification with automatically generated QR codes for seamless entry.</p>
              </mat-card-content>
            </mat-card>
          </div>
        </div>
      </section>

      <!-- User Roles Section -->
      <section class="roles">
        <div class="container">
          <h2>Perfect for Everyone</h2>
          <div class="roles-grid">
            <div class="role-card">
              <mat-icon class="role-icon">person</mat-icon>
              <h3>Attendees</h3>
              <ul>
                <li>Browse and discover events</li>
                <li>Book tickets securely</li>
                <li>Get QR code confirmations</li>
                <li>Manage your bookings</li>
              </ul>
              <button mat-button routerLink="/register" class="role-button">Join as Attendee</button>
            </div>

            <div class="role-card">
              <mat-icon class="role-icon">business</mat-icon>
              <h3>Organizers</h3>
              <ul>
                <li>Create and manage events</li>
                <li>Track ticket sales</li>
                <li>View attendee analytics</li>
                <li>Monitor revenue</li>
              </ul>
              <button mat-button routerLink="/register" class="role-button">Become Organizer</button>
            </div>

            <div class="role-card">
              <mat-icon class="role-icon">admin_panel_settings</mat-icon>
              <h3>Administrators</h3>
              <ul>
                <li>Oversee all events</li>
                <li>Manage users</li>
                <li>Generate reports</li>
                <li>System administration</li>
              </ul>
              <button mat-button routerLink="/register" class="role-button">Admin Access</button>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta">
        <div class="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of event organizers and attendees using Smart Event Planner</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" routerLink="/register" class="cta-button">
              Create Account
            </button>
            <button mat-stroked-button routerLink="/login" class="secondary-button">
              Sign In
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {}