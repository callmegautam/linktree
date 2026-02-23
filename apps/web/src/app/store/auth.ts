import { Injectable } from '@angular/core';
import { UserResponse } from '@linktree/validation';
import { BehaviorSubject, map, Observable } from 'rxjs';

const AUTH_KEY = 'auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly _user$: BehaviorSubject<UserResponse | null> =
    new BehaviorSubject<UserResponse | null>(this.loadFromStorage());

  // Use this to fetch user data from localStorage
  readonly user$: Observable<UserResponse | null> = this._user$.asObservable();

  // Use this to check whether user is logged in or not
  readonly isAuthenticated$: Observable<boolean> = this.user$.pipe(
    map((user: UserResponse | null) => !!user),
  );

  private loadFromStorage(): UserResponse | null {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  // Use this to set user in localStorage
  setUser(user: UserResponse): void {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    this._user$.next(user);
  }

  // Use this to clear / logged out the user
  clear(): void {
    localStorage.removeItem(AUTH_KEY);
    this._user$.next(null);
  }

  // Use this to check recent snapshot
  get snapshot(): UserResponse | null {
    return this._user$.value;
  }
}
