import { Routes } from '@angular/router';
import { TelaLoginNotes } from './user-module/tela-login-notes/tela-login-notes';
import { NewUserNotes } from './user-module/new-user-notes/new-user-notes';
import { AllNotes } from './user-module/all-notes/all-notes';


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
        path: 'chat',
        loadComponent: () => AllNotes,
    
       
    },
    {
        path: 'cadastro',
        loadComponent: () => NewUserNotes
    }
   
];