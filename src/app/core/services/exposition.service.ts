import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { CreateExpositionDto, Exposition, UpdateExpositionDto } from '../../models';

@Injectable({
  providedIn: 'root'
})

export class ExpositionService  {
  constructor(private supabase: SupabaseService) {}

    getAll(limit?: number, offset?: number): Observable<Exposition[]> {
    let query = this.supabase.client
      .from('expositions')
      .select('*')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    if (offset) {
      query = query.range(offset, offset + (limit || 10) - 1);
    }

    return from(query).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition[];
      }),
      catchError(err => throwError(() => err))
    );
  }

  getById(id: string): Observable<Exposition> {
    return from(
      this.supabase.client
        .from('expositions')
        .select('*')
        .eq('id', id)
        .single()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition;
      }),
      catchError(err => throwError(() => err))
    );
  }

  getByUserId(userId: string): Observable<Exposition[]> {
    return from(
      this.supabase.client
        .from('expositions')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition[];
      }),
      catchError(err => throwError(() => err))
    );
  }

  create(exposition: CreateExpositionDto, userId: string): Observable<Exposition> {
    const expositionData = {
      ...exposition,
      created_by: userId
    };

    return from(
      this.supabase.client
        .from('expositions')
        .insert([expositionData])
        .select()
        .single()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition;
      }),
      catchError(err => throwError(() => err))
    );
  }

  update(id: string, changes: UpdateExpositionDto): Observable<Exposition> {
    return from(
      this.supabase.client
        .from('expositions')
        .update(changes)
        .eq('id', id)
        .select()
        .single()
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition;
      }),
      catchError(err => throwError(() => err))
    );
  }

  delete(id: string): Observable<void> {
    return from(
      this.supabase.client
        .from('expositions')
        .delete()
        .eq('id', id)
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return;
      }),
      catchError(err => throwError(() => err))
    );
  }

  // Like/Dislike functionality
  updateLikes(id: string, increment: boolean = true): Observable<Exposition> {
    return from(
      this.supabase.client.rpc('increment_likes', {
        exposition_id: id,
        increment_value: increment ? 1 : -1
      })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition;
      }),
      catchError(err => throwError(() => err))
    );
  }

  updateDislikes(id: string, increment: boolean = true): Observable<Exposition> {
    return from(
      this.supabase.client.rpc('increment_dislikes', {
        exposition_id: id,
        increment_value: increment ? 1 : -1
      })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition;
      }),
      catchError(err => throwError(() => err))
    );
  }

  // Search functionality
  search(query: string): Observable<Exposition[]> {
    return from(
      this.supabase.client
        .from('expositions')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        return result.data as Exposition[];
      }),
      catchError(err => throwError(() => err))
    );
  }
}