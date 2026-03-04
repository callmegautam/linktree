import { environment } from '@/environment/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateLinkBody, LinkResponse, UpdateLinkBody } from '@linktree/validation';
import { Link } from '@/app/features/link/link';
import { ApiResponse } from '@linktree/shared-types';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly API_URL: string = `${environment.apicall}/profile`;

  constructor(private http: HttpClient) {}
}
