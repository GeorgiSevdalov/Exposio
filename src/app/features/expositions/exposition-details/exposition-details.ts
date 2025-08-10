import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExpositionService } from '../../../core/services/exposition.service';
import { Exposition } from '../../../models';

@Component({
  selector: 'app-exposition-details',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './exposition-details.html',
  styleUrl: './exposition-details.scss'
})
export class ExpositionDetails implements OnInit {
private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expositionService = inject(ExpositionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  exposition: Exposition | null = null;
  isLoading = true;
  error: string | null = null;
  currentImageIndex = 0;

  get isOwner(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.id === this.exposition?.created_by;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadExposition(id);
    }
  }

  loadExposition(id: string): void {
    this.isLoading = true;
    this.error = null;
    this.cdr.detectChanges(); // Force change detection

    this.expositionService.getById(id).subscribe({
      next: (exposition) => {
        this.exposition = exposition;
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      },
      error: (error) => {
        console.error('Error loading exposition:', error);
        this.error = 'Failed to load exposition';
        this.isLoading = false;
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }

  onImageClick(index: number): void {
    this.currentImageIndex = index;
  }

  onPreviousImage(): void {
    if (this.exposition && this.exposition.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex > 0 
        ? this.currentImageIndex - 1 
        : this.exposition.images.length - 1;
    }
  }

  onNextImage(): void {
    if (this.exposition && this.exposition.images.length > 0) {
      this.currentImageIndex = this.currentImageIndex < this.exposition.images.length - 1 
        ? this.currentImageIndex + 1 
        : 0;
    }
  }

  onEdit(): void {
    if (this.exposition) {
      this.router.navigate(['/expositions', this.exposition.id, 'edit']);
    }
  }

  onLike(): void {
    console.log('Like exposition');
    // TODO: Implement like functionality
  }

  onDislike(): void {
    console.log('Dislike exposition');
    // TODO: Implement dislike functionality
  }

  onBack(): void {
    this.router.navigate(['/expositions']);
  }
}
