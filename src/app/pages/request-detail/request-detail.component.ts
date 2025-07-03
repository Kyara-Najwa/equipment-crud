import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RequestService } from '../request-service/request-service.component';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RequestDetailComponent implements OnInit {
  request: any = null;
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.fetchRequest(id);
  }

  fetchRequest(id: string): void {
    this.requestService.getRequestById(id).subscribe({
      next: (res: any) => {
        this.request = res;
        if (res?.capture) {
          this.loadImage(res.capture);
        }
      },
      error: () => {
        alert('Gagal mengambil detail request.');
      }
    });
  }

  loadImage(capture: string): void {
    this.requestService.getFile(capture).subscribe({
      next: (blob: Blob) => {
        this.imageUrl = URL.createObjectURL(blob);
      },
      error: err => {
        if (err.status === 401) {
          alert('Gagal menampilkan gambar. Akses ditolak.');
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/request']);
  }
}
