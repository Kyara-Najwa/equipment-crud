// src/app/pages/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAll().subscribe({
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
    this.userService.update(this.editedUser).subscribe({
      next: () => {
        alert('Data user berhasil diperbarui.');
        this.cancelEdit();
        this.fetchUsers();
      },
      error: () => alert('Gagal memperbarui user.')
    });
  }

  deleteUser(id: number): void {
    if (!confirm('Yakin ingin menghapus user ini?')) return;

    this.userService.delete(id).subscribe({
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
