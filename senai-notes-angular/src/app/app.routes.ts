import { Routes } from '@angular/router';
import { TelaLoginNotes } from './user-module/tela-login-notes/tela-login-notes';
import { NewUserNotes } from './user-module/new-user-notes/new-user-notes';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => TelaLoginNotes,
        pathMatch: 'full' // ← aqui estava faltando a vírgula
    },
    {
        path: 'new',
        loadComponent: () => NewUserNotes
    }
];
