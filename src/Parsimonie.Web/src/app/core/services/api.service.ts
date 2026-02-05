import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MeResponse, Character } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // User endpoints
  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.baseUrl}/me`);
  }

  getMyCharacters(): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/me/characters`);
  }

  // Health check
  health(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.baseUrl.replace('/api', '')}/health`);
  }
}
