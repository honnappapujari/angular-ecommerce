import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated = signal(false);

  constructor(private http: HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  public get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // TODO: Implement actual login logic
    const user: User = {
      id: 1,
      email,
      name: 'Test User',
      role: 'user'
    };
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', 'dummy-token');
    this.currentUserSubject.next(user);
    this.isAuthenticated.set(true);
    return new Observable(subscriber => {
      subscriber.next(user);
      subscriber.complete();
    });
  }

  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, user)
      .pipe(
        map(newUser => {
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
          return newUser;
        })
      );
  }

  logout(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.isAuthenticated.set(false);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/auth/profile`, user)
      .pipe(
        map(updatedUser => {
          const currentUser = this.currentUser;
          const newUser = { ...currentUser, ...updatedUser };
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          this.currentUserSubject.next(newUser);
          return newUser;
        })
      );
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
