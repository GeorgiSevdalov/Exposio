import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';


export const routes: Routes = [
    // Home page (public)
  {
    path: '',
    loadComponent: () => import('./shared/components/home/home')
      .then(m => m.Home)
  },

  // Auth routes (public)
  {
    path: 'auth/login',
    loadComponent: () => import('./auth/login/login')
      .then(m => m.Login)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./auth/register/register')
      .then(m => m.Register)
  },
  {
    path: 'auth/profile',
    loadComponent: () => import('./auth/profile/profile')
      .then(m => m.Profile),
    canActivate: [AuthGuard]
  },

  // Expositions routes (public read, auth for create/edit)
  {
    path: 'expositions',
    loadComponent: () => import('./features/expositions/exposition-list/exposition-list')
      .then(m => m.ExpositionList)
  },
  {
    path: 'expositions/create',
    loadComponent: () => import('./features/expositions/exposition-form/exposition-form')
      .then(m => m.ExpositionForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'expositions/:id',
    loadComponent: () => import('./features/expositions/exposition-details/exposition-details')
      .then(m => m.ExpositionDetails)
  },
  {
    path: 'expositions/:id/edit',
    loadComponent: () => import('./features/expositions/exposition-form/exposition-form')
      .then(m => m.ExpositionForm),
    canActivate: [AuthGuard]
  },

  // Sale Ads routes (public read, auth for create/edit)
  {
    path: 'sale-ads',
    loadComponent: () => import('./features/sale-ads/ad-list/ad-list')
      .then(m => m.AdList)
  },
  {
    path: 'sale-ads/create',
    loadComponent: () => import('./features/sale-ads/ad-form/ad-form')
      .then(m => m.AdForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'sale-ads/:id',
    loadComponent: () => import('./features/sale-ads/ad-details/ad-details')
      .then(m => m.AdDetails)
  },
  {
    path: 'sale-ads/:id/edit',
    loadComponent: () => import('./features/sale-ads/ad-form/ad-form')
      .then(m => m.AdForm),
    canActivate: [AuthGuard]
  },

  // Dashboard (protected)
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/user-dashboard/user-dashboard')
      .then(m => m.UserDashboard),
    canActivate: [AuthGuard]
  },

  // Redirects
  {
    path: 'login',
    redirectTo: 'auth/login'
  },
  {
    path: 'register',
    redirectTo: 'auth/register'
  },

  // 404 fallback
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found')
      .then(m => m.NotFound)
  }
];
