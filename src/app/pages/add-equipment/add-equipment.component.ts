// src/app/pages/add-equipment/add-equipment.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EquipmentService } from '../../services/equipment.service'; // pastikan path benar

@Component({
  selector: 'app-add-equipment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-equipment.component.html',
  styleUrls: ['./add-equipment.component.css']
})
export class AddEquipmentComponent {
  newEquipment = {
    equipment: 1,
    modelName: '',
    description: '',
    location: ''
  };

  constructor(
    private equipmentService: EquipmentService,
    private router: Router
  ) {}

  addEquipment(): void {
    this.equipmentService.add(this.newEquipment).subscribe({
      next: () => {
        alert('Equipment berhasil ditambahkan!');
        this.newEquipment = {
          equipment: 1,
          modelName: '',
          description: '',
          location: ''
        };
        this.router.navigate(['/equipment']);
      },
      error: () => {
        alert('Gagal menambahkan equipment.');
      }
    });
  }
}
