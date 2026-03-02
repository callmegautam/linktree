import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AuthStore } from '@/app/store/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authStore: AuthStore,
    private router: Router,
  ) {}

  canActivate() {
    return this.authStore.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        }
        return this.router.createUrlTree(['/login']);
      }),
    );
  }
}
