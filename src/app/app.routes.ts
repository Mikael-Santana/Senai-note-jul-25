import { Routes } from '@angular/router';
import { authGuard } from '../../auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  { 
    path: 'login', 
    loadComponent: () => import('./user-module/tela-login-notes/tela-login-notes').then(m => m.TelaLoginNotes)
  },
  
  { 
    path: 'all-notes', 
    loadComponent: () => import('./user-module/all-notes/all-notes').then(m => m.AllNotes), 
    canActivate: [authGuard]
  },
  
  { 
    path: 'new-user-notes', 
    loadComponent: () => import('./user-module/new-user-notes/new-user-notes').then(m => m.NewUserNotes)
  },
  
  { path: '**', redirectTo: 'login' }
];
