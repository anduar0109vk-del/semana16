import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());

  currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem('coffeecraft_user');
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success) {
          let resolvedRole = res.role;
          if (res.username === 'cliente') {
            resolvedRole = 'ROLE_CLIENT';
          } else if (res.username === 'admin') {
            resolvedRole = 'ROLE_ADMIN';
          } else if (res.username === 'demo') {
            resolvedRole = 'ROLE_BARISTA';
          } else if (!resolvedRole) {
            resolvedRole = 'ROLE_CLIENT';
          }

          const user: User = {
            id: res.id,
            username: res.username || '',
            fullName: res.fullName || '',
            role: resolvedRole,
            token: res.token
          };
          localStorage.setItem('coffeecraft_user', JSON.stringify(user));
          if (res.token) {
            localStorage.setItem('coffeecraft_token', res.token);
          }
          this.currentUserSignal.set(user);
        }
      })
    );
  }

  register(userData: { username: string; password: string; fullName: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('coffeecraft_user');
    localStorage.removeItem('coffeecraft_token');
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSignal();
  }

  getUser(): User | null {
    return this.currentUserSignal();
  }
}
