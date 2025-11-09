import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService, UserData } from '../../services/auth.service';

declare const feather: any;

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit, AfterViewInit, AfterViewChecked {
  userName: string = 'User';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsed: UserData = JSON.parse(user);
        this.userName = parsed.name || 'User';
      } catch (e) {
        console.error('Gagal parsing user dari localStorage:', e);
      }
    }

    this.authService.user$.subscribe((user) => {
      if (user) {
        this.userName = user.name || 'User';
      }
    });
  }

  ngAfterViewInit(): void {
    feather.replace();
  }

  ngAfterViewChecked(): void {
    feather.replace();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
