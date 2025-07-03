import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService, UserData } from '../../auth-service/auth-service.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const credentials = this.loginForm.value;

    this.http.post<any>('http://192.168.5.200:60776/api/General/Login', credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.accessToken || '');

        const userData: UserData = {
          name: res.name,
          email: res.email,
          roleName: res.roleName,
          userId: res.userId
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.authService.setUser(userData);

        this.router.navigate(['/equipment']);
      },
      error: () => {
        this.errorMessage = 'Email atau password salah!';
      }
    });
  }
}
