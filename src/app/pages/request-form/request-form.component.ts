import { Component, OnInit, inject } from '@angular/core';
import { GEOLOCATION } from '@ng-web-apis/geolocation';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RequestFormComponent implements OnInit {
  private geolocation = inject(GEOLOCATION);

  equipments: any[] = [];
  selectedEqId: string = '';
  problems: string[] = [];
  description: string = '';
  selectedFile: File | null = null;
  latitude: number = 0;
  longitude: number = 0;

  errorMessages: any = {
    selectedEqId: '',
    problems: '',
    latitude: '',
    longitude: ''
  };

  constructor(
    private requestService: RequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.requestService.getEquipments().subscribe({
      next: (data) => this.equipments = data,
      error: () => alert('Gagal mengambil data equipment.')
    });

    this.geolocation.getCurrentPosition(
      (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        console.log('Lokasi berhasil diambil:', this.latitude, this.longitude);
      },
      (err: GeolocationPositionError) => {
        console.error('Gagal mengambil lokasi:', err.message);
        this.errorMessages.latitude = 'Gagal ambil latitude';
        this.errorMessages.longitude = 'Gagal ambil longitude';
      }
    );
  }

  handleProblemCheckbox(event: Event, problemId: string): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.problems.includes(problemId)) this.problems.push(problemId);
    } else {
      this.problems = this.problems.filter(p => p !== problemId);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input?.files?.[0] || null;
  }

  clearErrors(): void {
    this.errorMessages = {
      selectedEqId: '',
      problems: '',
      latitude: '',
      longitude: ''
    };
  }

  submitRequest(): void {
    this.clearErrors();
    let valid = true;

    if (!this.selectedEqId) {
      this.errorMessages.selectedEqId = 'Equipment harus dipilih.';
      valid = false;
    }

    if (this.problems.length === 0) {
      this.errorMessages.problems = 'Pilih minimal satu problem.';
      valid = false;
    }

    if (!this.latitude) {
      this.errorMessages.latitude = 'Latitude tidak boleh kosong.';
      valid = false;
    }

    if (!this.longitude) {
      this.errorMessages.longitude = 'Longitude tidak boleh kosong.';
      valid = false;
    }

    if (!valid) return;

    const param = {
      id: 0,
      equipmentId: parseInt(this.selectedEqId),
      latitude: this.latitude,
      longitude: this.longitude,
      description: this.description,
      capture: null,
      details: this.problems.map(p => ({ serviceid: p }))
    };

    const formData = new FormData();
    formData.append('param', JSON.stringify(param));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.requestService.create(formData).subscribe({
      next: () => {
        this.resetForm();
        this.router.navigate(['/request']);
      },
      error: (err) => {
        const msg = err?.error || 'Gagal submit request.';
        alert(`Gagal submit request: ${msg}`);
      }
    });
  }

  resetForm(): void {
    this.selectedEqId = '';
    this.problems = [];
    this.description = '';
    this.latitude = 0;
    this.longitude = 0;
    this.selectedFile = null;
  }
}
