import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserProfile(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/${userId}`);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const body = {
      OldPassword: oldPassword,
      NewPassword: newPassword
    };

    return this.http.post(`${this.apiUrl}/User/ChangePassword`, body, {
      responseType: 'text'
    });
  }
}