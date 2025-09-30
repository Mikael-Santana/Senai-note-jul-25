import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('meuToken');
  const userId = localStorage.getItem('meuId');

  return token && userId ? true : router.parseUrl('/login');
};
