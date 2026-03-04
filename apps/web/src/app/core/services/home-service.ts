import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@linktree/shared-types';
import { HomePageResponse } from '@linktree/validation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly API_URL: string = `${environment.apicall}/home`;

  constructor(private http: HttpClient) {}

  getHomePage(username: string): Observable<ApiResponse<HomePageResponse>> {
    return this.http.get<ApiResponse<HomePageResponse>>(`${this.API_URL}/${username}`);
  }
}
