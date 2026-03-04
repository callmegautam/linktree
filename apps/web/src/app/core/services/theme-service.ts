import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@linktree/shared-types';
import { ThemeResponse, UpdateThemeBody } from '@linktree/validation';
import { Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL: string = `${environment.apicall}/theme`;

  constructor(private http: HttpClient) {}

  updateTheme(payload: UpdateThemeBody): Observable<ApiResponse<ThemeResponse>> {
    return this.http.put<ApiResponse<ThemeResponse>>(`${this.API_URL}/`, payload);
  }
}
