import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginBody, RegisterBody, UserResponse } from '@linktree/validation';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '@linktree/shared-types';
import { AuthStore } from '@/app/store/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL: string = `${environment.apicall}/auth`;

  constructor(
    private http: HttpClient,
    private authStore: AuthStore,
  ) {}

  login(payload: LoginBody): Observable<ApiResponse<UserResponse>> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.API_URL}/login`, payload)
      .pipe(tap((res) => this.authStore.setUser(res.data!)));
  }

  register(payload: RegisterBody): Observable<ApiResponse<UserResponse>> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.API_URL}/register`, payload)
      .pipe(tap((res) => this.authStore.setUser(res.data!)));
  }

  deleteUser(): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(`${this.API_URL}`).pipe(
      tap(() => {
        this.authStore.clear();
      }),
    );
  }
}
