import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/equipment']);
    }
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const data = this.loginForm.value;

    this.http.post<any>('http://192.168.5.200:60776/api/General/Login', {
      emailAddress: data.emailAddress,
      password: data.password
    }).subscribe({
      next: res => {
        console.log('LOGIN RESPONSE:', res);

        localStorage.setItem('token', res.accessToken || '');

        const userId = res.userId;
        if (userId !== undefined && userId !== null) {
          localStorage.setItem('userId', String(userId));
        } else {
          console.error('Login sukses tapi ID user ga onok ndek respons.');
        }

        this.router.navigate(['/equipment']);
      },
      error: () => {
        this.errorMessage = 'Login gagal! Email atau password salah.';
      }
    });
  }
}
