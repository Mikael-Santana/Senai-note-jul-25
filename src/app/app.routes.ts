import { Routes } from '@angular/router';
import { TelaLoginNotes } from './user-module/tela-login-notes/tela-login-notes';
import { NewUserNotes } from './user-module/new-user-notes/new-user-notes';
import { AllNotes } from './user-module/all-notes/all-notes';
import { authGuard } from '../../auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => TelaLoginNotes },
  { path: 'chat', loadComponent: () => AllNotes, canActivate: [authGuard] },
  { path: 'cadastro', loadComponent: () => NewUserNotes },
  { path: '**', redirectTo: 'login' }
];



// import { Routes } from '@angular/router';
// import { TelaLoginNotes } from './user-module/tela-login-notes/tela-login-notes';
// import { NewUserNotes } from './user-module/new-user-notes/new-user-notes';
// import { AllNotes } from './user-module/all-notes/all-notes';
// import { authGuard } from '../../auth.guard';



// export const routes: Routes = [
//   {
//     path: '',
//     redirectTo: 'login',
//     pathMatch: 'full'
//   },
//   {
//     path: 'login',
//     loadComponent: () => TelaLoginNotes
//   },
//   {
//     path: 'chat',
//     loadComponent: () => AllNotes,   // 🚀 Chat = AllNotes
//     canActivate: [authGuard]},
//   {
//     path: 'cadastro',
//     loadComponent: () => NewUserNotes
//   },
//   {
//     path: '**',
//     redirectTo: 'login'
//   }
// ];
