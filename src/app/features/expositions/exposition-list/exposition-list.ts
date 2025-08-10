import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ExpositionCard } from '../exposition-card/exposition-card';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ExpositionService } from '../../../core/services/exposition.service';
import { Exposition } from '../../../models';

@Component({
  selector: 'app-exposition-list',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    ExpositionCard
  ],
  templateUrl: './exposition-list.html',
  styleUrl: './exposition-list.scss'
})
export class ExpositionList implements OnInit {
  private expositionService = inject(ExpositionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  expositions: Exposition[] = [];
  isLoading = false;
  error: string | null = null;
  sortBy = 'newest';

  isAuthenticated$: Observable<boolean>;

  constructor() {
    this.isAuthenticated$ = this.authService.authState$.pipe(
      map(state => !!state.user)
    );
  }

  ngOnInit(): void {
    this.loadExpositions();
  }

  loadExpositions(): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges(); // Force change detection

    this.expositionService.getAll().subscribe({
      next: (expositions) => {
        this.expositions = this.sortExpositions(expositions);
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading expositions:', error);
        this.error = 'Failed to load expositions. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  onSortChange(): void {
    this.expositions = this.sortExpositions(this.expositions);
  }

  private sortExpositions(expositions: Exposition[]): Exposition[] {
    switch (this.sortBy) {
      case 'newest':
        return [...expositions].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'oldest':
        return [...expositions].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case 'mostLiked':
        return [...expositions].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'alphabetical':
        return [...expositions].sort((a, b) => a.title.localeCompare(b.title));
      default:
        return expositions;
    }
  }

  onRetry(): void {
    this.loadExpositions();
  }
}
