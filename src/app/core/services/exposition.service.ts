import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { catchError, from, map, Observable, throwError, switchMap } from 'rxjs';
import { 
  Exposition, 
  CreateExpositionDto, 
  UpdateExpositionDto, 
} from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ExpositionService {
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

  // Like/Dislike functionality - simplified approach
  toggleLike(expositionId: string, userId: string): Observable<{likes: number, dislikes: number, userLiked: boolean}> {
    // First check if user already liked this exposition
    return from(
      this.supabase.client
        .from('user_exposition_interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('exposition_id', expositionId)
        .eq('interaction_type', 'like')
    ).pipe(
      switchMap(checkResult => {
        if (checkResult.error) throw checkResult.error;
        
        const hasLiked = checkResult.data && checkResult.data.length > 0;
        
        if (hasLiked) {
          // User wants to unlike - remove the like
          return from(
            this.supabase.client
              .from('user_exposition_interactions')
              .delete()
              .eq('user_id', userId)
              .eq('exposition_id', expositionId)
              .eq('interaction_type', 'like')
          ).pipe(
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_like', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'unlike'
              }))
            ),
            map(result => {
              if (result.error) throw result.error;
              const data = result.data?.[0] || { likes: 0, dislikes: 0 };
              return {
                likes: data.likes,
                dislikes: data.dislikes,
                userLiked: false
              };
            })
          );
        } else {
          // User wants to like - first remove any dislike, then add like
          return from(
            this.supabase.client
              .from('user_exposition_interactions')
              .delete()
              .eq('user_id', userId)
              .eq('exposition_id', expositionId)
              .eq('interaction_type', 'dislike')
          ).pipe(
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_dislike', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'undislike'
              }))
            ),
            switchMap(() => 
              from(this.supabase.client
                .from('user_exposition_interactions')
                .insert({
                  user_id: userId,
                  exposition_id: expositionId,
                  interaction_type: 'like'
                })
              )
            ),
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_like', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'like'
              }))
            ),
            map(result => {
              if (result.error) throw result.error;
              const data = result.data?.[0] || { likes: 0, dislikes: 0 };
              return {
                likes: data.likes,
                dislikes: data.dislikes,
                userLiked: true
              };
            })
          );
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  toggleDislike(expositionId: string, userId: string): Observable<{likes: number, dislikes: number, userDisliked: boolean}> {
    // First check if user already disliked this exposition
    return from(
      this.supabase.client
        .from('user_exposition_interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('exposition_id', expositionId)
        .eq('interaction_type', 'dislike')
    ).pipe(
      switchMap(checkResult => {
        if (checkResult.error) throw checkResult.error;
        
        const hasDisliked = checkResult.data && checkResult.data.length > 0;
        
        if (hasDisliked) {
          // User wants to undislike - remove the dislike
          return from(
            this.supabase.client
              .from('user_exposition_interactions')
              .delete()
              .eq('user_id', userId)
              .eq('exposition_id', expositionId)
              .eq('interaction_type', 'dislike')
          ).pipe(
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_dislike', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'undislike'
              }))
            ),
            map(result => {
              if (result.error) throw result.error;
              const data = result.data?.[0] || { likes: 0, dislikes: 0 };
              return {
                likes: data.likes,
                dislikes: data.dislikes,
                userDisliked: false
              };
            })
          );
        } else {
          // User wants to dislike - first remove any like, then add dislike
          return from(
            this.supabase.client
              .from('user_exposition_interactions')
              .delete()
              .eq('user_id', userId)
              .eq('exposition_id', expositionId)
              .eq('interaction_type', 'like')
          ).pipe(
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_like', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'unlike'
              }))
            ),
            switchMap(() => 
              from(this.supabase.client
                .from('user_exposition_interactions')
                .insert({
                  user_id: userId,
                  exposition_id: expositionId,
                  interaction_type: 'dislike'
                })
              )
            ),
            switchMap(() => 
              from(this.supabase.client.rpc('handle_exposition_dislike', {
                exposition_id: expositionId,
                user_id: userId,
                action: 'dislike'
              }))
            ),
            map(result => {
              if (result.error) throw result.error;
              const data = result.data?.[0] || { likes: 0, dislikes: 0 };
              return {
                likes: data.likes,
                dislikes: data.dislikes,
                userDisliked: true
              };
            })
          );
        }
      }),
      catchError(err => throwError(() => err))
    );
  }

  getUserInteractions(expositionId: string, userId: string): Observable<{userLiked: boolean, userDisliked: boolean}> {
    return from(
      this.supabase.client
        .from('user_exposition_interactions')
        .select('interaction_type')
        .eq('user_id', userId)
        .eq('exposition_id', expositionId)
    ).pipe(
      map(result => {
        if (result.error) throw result.error;
        const interactions = result.data || [];
        return {
          userLiked: interactions.some(i => i.interaction_type === 'like'),
          userDisliked: interactions.some(i => i.interaction_type === 'dislike')
        };
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