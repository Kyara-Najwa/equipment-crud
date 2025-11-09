// src/app/pages/role-list/role-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RoleService } from '../../services/role.service';

@Component({
  standalone: true,
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RoleListComponent implements OnInit {
  roles: any[] = [];
  filteredRoles: any[] = [];
  searchKeyword: string = '';

  constructor(private roleService: RoleService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getAllRoles().subscribe({
      next: data => {
        this.roles = data;
        this.filteredRoles = data;
      },
      error: () => alert('Gagal mengambil data role.')
    });
  }

  searchRoles(): void {
    const keyword = this.searchKeyword.trim().toLowerCase();
    if (!keyword) {
      this.filteredRoles = this.roles;
    } else {
      this.filteredRoles = this.roles.filter(role =>
        role.roleName.toLowerCase().includes(keyword)
      );
    }
  }

  editRole(roleId: number): void {
    alert(`Edit role ID ${roleId}`);
  }

  deleteRole(roleId: number): void {
    if (!confirm(`Yakin ingin menghapus role ID ${roleId}?`)) return;

    this.roleService.deleteRole(roleId).subscribe({
      next: () => {
        alert('Role berhasil dihapus!');
        this.loadRoles();
      },
      error: () => alert('Gagal menghapus role.')
    });
  }
}
