import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { Exposition } from '../../../models';

@Component({
  selector: 'app-exposition-card',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './exposition-card.html',
  styleUrl: './exposition-card.scss'
})
export class ExpositionCard {
  @Input() exposition!: Exposition;
  @Input() showActions = true;

  private router = inject(Router);
  private authService = inject(AuthService);

  get isOwner(): boolean {
    const currentUser = this.authService.currentUser;
    return currentUser?.id === this.exposition.created_by;
  }

  get previewImage(): string {
    return this.exposition.images && this.exposition.images.length > 0 
      ? this.exposition.images[0] 
      : '/assets/images/placeholder-exposition.jpg';
  }

  get imageCount(): number {
    return this.exposition.images ? this.exposition.images.length : 0;
  }

  onCardClick(): void {
    this.router.navigate(['/expositions', this.exposition.id]);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/expositions', this.exposition.id, 'edit']);
  }

  onLike(event: Event): void {
    event.stopPropagation();
    // TODO: Implement like functionality
    console.log('Like exposition:', this.exposition.id);
  }

  onDislike(event: Event): void {
    event.stopPropagation();
    // TODO: Implement dislike functionality
    console.log('Dislike exposition:', this.exposition.id);
  }
}
