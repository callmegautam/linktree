import { Injectable } from '@angular/core';
import { AdminResponse } from '@linktree/validation';
import { BehaviorSubject, map, Observable } from 'rxjs';

const ADMIN_AUTH_KEY = 'auth_admin';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthStore {
  private readonly _admin$: BehaviorSubject<AdminResponse | null> =
    new BehaviorSubject<AdminResponse | null>(this.loadFromStorage());

  readonly admin$: Observable<AdminResponse | null> = this._admin$.asObservable();

  readonly isAuthenticated$: Observable<boolean> = this.admin$.pipe(
    map((admin: AdminResponse | null) => !!admin?.token),
  );

  private loadFromStorage(): AdminResponse | null {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  setAdmin(admin: AdminResponse): void {
    localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(admin));
    this._admin$.next(admin);
  }

  clear(): void {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    this._admin$.next(null);
  }

  get snapshot(): AdminResponse | null {
    return this._admin$.value;
  }
}
