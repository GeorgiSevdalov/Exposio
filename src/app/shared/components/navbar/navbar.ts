import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatDividerModule, 
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;

  constructor() {
    this.currentUser$ = this.authService.authState$.pipe(
      map(state => state.user as User | null)
    );
    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(state => !!state.user)
    );
  }

  async logout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  navigateToProfile(): void {
    this.router.navigate(['/auth/profile']);
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToCreate(): void {
    // Could open a menu or navigate to create exposition
    this.router.navigate(['/expositions/create']);
  }
}
