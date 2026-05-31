import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import {
  EarlyDetectionResult,
  EdModelSpec,
  EARLY_DETECTION_MODELS,
} from '../../core/models/early-detection.models';
import { EarlyDetectionService } from '../../core/api/early-detection.service';

@Component({
  selector: 'app-early-detection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './early-detection.component.html',
  styleUrls: ['./early-detection.component.css'],
})
export class EarlyDetectionComponent implements OnInit {
  readonly models: EdModelSpec[] = EARLY_DETECTION_MODELS;

  selectedModel: EdModelSpec = this.models[0];
  features: Record<string, number | null> = {};

  loading = false;
  error = '';
  result: EarlyDetectionResult | null = null;
  hasSubmitted = false;

  constructor(private edService: EarlyDetectionService) {}

  ngOnInit(): void {
    this.resetForm();
  }

  onModelChange(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.features = {};
    for (const field of this.selectedModel.fields) {
      this.features[field.key] = null;
    }
    this.result = null;
    this.error = '';
    this.hasSubmitted = false;
  }

  get allFieldsFilled(): boolean {
    return this.selectedModel.fields.every(
      (f) => this.features[f.key] !== null && this.features[f.key] !== undefined
    );
  }

  runScreening(): void {
    this.hasSubmitted = true;
    if (!this.allFieldsFilled) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.result = null;

    const payload: Record<string, number> = {};
    for (const field of this.selectedModel.fields) {
      payload[field.key] = this.features[field.key] as number;
    }

    this.edService.predict(this.selectedModel.key, payload).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 503) {
          this.error = 'ML service unavailable — please try again later.';
        } else if (err.status === 400) {
          this.error = 'Invalid request: check that all fields are filled correctly.';
        } else {
          this.error = 'An unexpected error occurred. Please try again.';
        }
        this.loading = false;
      },
    });
  }

  confidencePct(): string | null {
    if (this.result?.confidence == null) return null;
    return (this.result.confidence * 100).toFixed(1) + '%';
  }
}
