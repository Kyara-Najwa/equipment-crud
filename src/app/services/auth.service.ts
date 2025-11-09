import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface UserData {
  userId: number;
  name: string;
  email: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<UserData | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('API URL:', this.apiUrl);
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  register(user: any): Observable<any> {
  return this.http.post(`${this.apiUrl}/General/Register`, user, {
    headers: { 'Content-Type': 'application/json' },
    responseType: 'text'
  });
  }


  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/General/Login`, credentials);
  }

  setUser(user: UserData): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UserData | null {
    return this.userSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
    this.userSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
