import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { User } from '@supabase/supabase-js';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile {
  private authService = inject(AuthService);
  
  currentUser$?: Observable<User | null>;

  ngOnInit(): void {
    this.currentUser$ = this.authService.authState$.pipe(
      map(state => state.user as User | null)
    );
  }

  async logout(): Promise<void> {
    await this.authService.signOut();
  }
}
