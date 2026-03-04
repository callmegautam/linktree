import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AdminAuthStore } from '@/app/store/admin-auth';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
  constructor(
    private adminAuthStore: AdminAuthStore,
    private router: Router,
  ) {}

  canActivate() {
    return this.adminAuthStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/admin/login']);
      }),
    );
  }
}
