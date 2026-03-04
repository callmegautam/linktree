import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateLinkBody,
  LinkResponse,
  ProfileResponse,
  UpdateLinkBody,
  UpdateProfileBody,
} from '@linktree/validation';
import { Link } from '@/app/features/link/link';
import { ApiResponse } from '@linktree/shared-types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL: string = `${environment.apicall}/profile`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<ApiResponse<ProfileResponse>> {
    return this.http.get<ApiResponse<ProfileResponse>>(`${this.API_URL}/`);
  }

  UpdateProfile(payload: UpdateProfileBody): Observable<ApiResponse<ProfileResponse>> {
    return this.http.patch<ApiResponse<ProfileResponse>>(`${this.API_URL}/`, payload);
  }
  uploadAvatar(formData: FormData) {
    return this.http.post<{ ok: boolean; data: { url: string } }>(
      `${this.API_URL}/upload-avatar`,
      formData,
    );
  }
}
