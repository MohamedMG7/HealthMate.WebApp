import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DocumentService } from '../../core/api/document.service';

@Component({
  selector: 'app-document-viewer',
  standalone: true,
  imports: [],
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {
  documentName = '';
  documentPath = '';
  documentUrl: SafeUrl | null = null;
  errorMessage = '';

  // Zoom + Pan
  zoom = 1;
  minZoom = 0.5;
  maxZoom = 3;
  translateX = 0;
  translateY = 0;
  isPanning = false;
  startX = 0;
  startY = 0;
  transitionStyle = 'transform 0.05s ease-out';

  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.documentName = queryParams['name'] || 'Document';
    this.documentPath = queryParams['path'] || '';

    if (this.documentPath) {
      this.documentService.download(this.documentPath).subscribe({
        next: (blob) => {
          const objectURL = URL.createObjectURL(blob);
          this.documentUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error: () => {
          this.errorMessage = 'Failed to load document.';
        }
      });
    }
  }

  get transform(): string {
    return `scale(${this.zoom}) translate(${this.translateX / this.zoom}px, ${this.translateY / this.zoom}px)`;
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.1 : 0.1;
    const newZoom = this.zoom + delta;
    this.zoom = Math.min(this.maxZoom, Math.max(this.minZoom, newZoom));
  }

  onMouseDown(event: MouseEvent): void {
    this.isPanning = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
    this.transitionStyle = 'none';
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isPanning) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  onMouseUp(): void {
    this.isPanning = false;
    this.transitionStyle = 'transform 0.05s ease-out';
  }
}
