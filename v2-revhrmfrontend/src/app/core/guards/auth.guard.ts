import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLoggedIn()) return true;
  router.navigate(['/login']);
  return false;
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }
  if (auth.getRole() === 'ADMIN') return true;
  router.navigate(['/unauthorized']);
  return false;
};

export const managerGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }
  const role = auth.getRole();
  if (role === 'MANAGER' || role === 'ADMIN') return true;
  router.navigate(['/unauthorized']);
  return false;
};

export const employeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isLoggedIn()) { router.navigate(['/login']); return false; }
  const role = auth.getRole();
  if (role === 'EMPLOYEE' || role === 'MANAGER' || role === 'ADMIN') return true;
  router.navigate(['/unauthorized']);
  return false;
};