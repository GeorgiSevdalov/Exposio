import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ExpositionService } from '../../core/services/exposition.service';
import { Exposition } from '../../models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboard implements OnInit {
  private authService = inject(AuthService);
  private expositionService = inject(ExpositionService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  currentUser$?: Observable<User | null>;
  userExpositions: Exposition[] = [];
  isLoading = true;

  // Computed properties
  get recentExpositions(): Exposition[] {
    return this.userExpositions.slice(0, 3);
  }

  get totalImages(): number {
    return this.userExpositions.reduce((total, expo) =>
      total + (expo.images?.length || 0), 0);
  }

  get totalLikes(): number {
    return this.userExpositions.reduce((total, expo) =>
      total + (expo.likes || 0), 0);
  }

  get lastActivity(): Date | null {
    if (this.userExpositions.length === 0) return null;
    const latest = this.userExpositions.reduce((latest, expo) =>
      new Date(expo.created_at) > new Date(latest.created_at) ? expo : latest);
    return new Date(latest.created_at);
  }

  ngOnInit(): void {
    this.currentUser$ = this.authService.authState$.pipe(
      map(state => state.user as User | null)
    );

    this.loadUserData();
  }

  loadUserData(): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return;

    this.isLoading = true;
    this.cdr.detectChanges();

    this.expositionService.getByUserId(currentUser.id).subscribe({
      next: (expositions) => {
        this.userExpositions = expositions;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading user expositions:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  navigateToExposition(id: string): void {
    this.router.navigate(['/expositions', id]);
  }

  editExposition(event: Event, id: string): void {
    event.stopPropagation();
    this.router.navigate(['/expositions', id, 'edit']);
  }
}
