import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginBody, RegisterBody, UserResponse } from '@linktree/validation';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '@linktree/shared-types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL: string = `${environment.apicall}/auth`;

  constructor(private http: HttpClient) {}

  login(payload: LoginBody): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.API_URL}/login`, payload);
  }

  register(payload: RegisterBody): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.API_URL}/register`, payload);
  }
}
