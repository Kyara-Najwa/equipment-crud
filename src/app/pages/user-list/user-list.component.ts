import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  editUserId: number | null = null;
  editedUser: any = {};
  private baseUrl = 'http://192.168.5.200:60776';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  fetchUsers(): void {
    this.http.get<any[]>(`${this.baseUrl}/api/User`, {
      headers: this.getAuthHeaders()
    }).subscribe({
      next: data => this.users = data,
      error: () => alert('Gagal mengambil data user.')
    });
  }

  startEdit(user: any): void {
    this.editUserId = user.id;
    this.editedUser = { ...user };
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editedUser = {};
  }

  saveEdit(): void {
    const payload = {
      id: this.editedUser.id,
      emailAddress: this.editedUser.emailAddress,
      fullName: this.editedUser.fullName,
      companyName: this.editedUser.companyName,
      telp: this.editedUser.telp,
      roleId: this.editedUser.roleId
    };

    this.http.put(`${this.baseUrl}/api/User`, payload, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('Data user berhasil diperbarui.');
        this.cancelEdit();
        this.fetchUsers();
      },
      error: () => alert('Gagal memperbarui user.')
    });
  }

  deleteUser(id: number): void {
    const confirmDelete = confirm('Yakin ingin menghapus user ini?');
    if (!confirmDelete) return;

    this.http.delete(`${this.baseUrl}/api/User/${id}`, {
      headers: this.getAuthHeaders(),
      responseType: 'text'
    }).subscribe({
      next: () => {
        alert('User berhasil dihapus.');
        this.fetchUsers();
      },
      error: err => {
        alert(`Gagal menghapus user. Status: ${err.status} - ${err.statusText}`);
      }
    });
  }
}
