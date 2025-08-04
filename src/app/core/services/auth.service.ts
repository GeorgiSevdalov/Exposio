import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';
import { User, AuthState, LoginCredentials, RegisterCredentials, ApiResponse } from '../../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  public authState$: Observable<AuthState> = this.authStateSubject.asObservable();

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const user = await this.supabase.getCurrentUser();
      this.authStateSubject.next({
        user: user as User,
        loading: false,
        error: null
      });

      // Listen to auth changes
      this.supabase.auth.onAuthStateChange((event, session) => {
        const currentState = this.authStateSubject.value;
        this.authStateSubject.next({
          ...currentState,
          user: session?.user as User || null,
          loading: false
        });

        if (event === 'SIGNED_OUT') {
          this.router.navigate(['/']);
        }
      });
    } catch (error) {
      this.authStateSubject.next({
        user: null,
        loading: false,
        error: 'Failed to initialize authentication'
      });
    }
  }

  async signUp(credentials: RegisterCredentials): Promise<ApiResponse<User>> {
    try {
      this.setLoading(true);
      
      if (credentials.password !== credentials.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const { data, error } = await this.supabase.signUp(
        credentials.email,
        credentials.password
      );

      if (error) throw error;

      return {
        data: data.user as User,
        error: null
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed';
      this.setError(errorMessage);
      return {
        data: null,
        error: errorMessage
      };
    } finally {
      this.setLoading(false);
    }
  }

  async signIn(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    try {
      this.setLoading(true);
      
      const { data, error } = await this.supabase.signIn(
        credentials.email,
        credentials.password
      );

      if (error) throw error;

      return {
        data: data.user as User,
        error: null
      };
    } catch (error: any) {
      const errorMessage = error.message || 'Login failed';
      this.setError(errorMessage);
      return {
        data: null,
        error: errorMessage
      };
    } finally {
      this.setLoading(false);
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.supabase.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  get currentUser(): User | null {
    return this.authStateSubject.value.user;
  }

  get isAuthenticated(): boolean {
    return !!this.authStateSubject.value.user;
  }

  get isLoading(): boolean {
    return this.authStateSubject.value.loading;
  }

  private setLoading(loading: boolean) {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      loading,
      error: null
    });
  }

  private setError(error: string) {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error
    });
  }

  clearError() {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error: null
    });
  }
}