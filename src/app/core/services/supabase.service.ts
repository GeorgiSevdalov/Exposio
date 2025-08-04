import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})

export class SupabaseService  {
 private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get auth() {
    return this.supabase.auth;
  }

  get storage() {
    return this.supabase.storage;
  }

  async signUp(email: string, password: string) {
    return await this.supabase.auth.signUp({
      email,
      password
    });
  }

  async signIn(email: string, password: string) {
    return await this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return await this.supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  async uploadFile(bucket: string, path: string, file: File) {
    return await this.supabase.storage
      .from(bucket)
      .upload(path, file);
  }

  getPublicUrl(bucket: string, path: string) {
    return this.supabase.storage
      .from(bucket)
      .getPublicUrl(path);
  }

  async deleteFile(bucket: string, paths: string[]) {
    return await this.supabase.storage
      .from(bucket)  
      .remove(paths);
  }
}
