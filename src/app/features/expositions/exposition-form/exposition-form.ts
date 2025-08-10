import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ExpositionService } from '../../../core/services/exposition.service';
import { CreateExpositionDto, UpdateExpositionDto } from '../../../models';

@Component({
  selector: 'app-exposition-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './exposition-form.html',
  styleUrl: './exposition-form.scss'
})
export class ExpositionForm {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private expositionService = inject(ExpositionService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  expositionForm: FormGroup;
  imageUrlControl = new FormControl('');
  isLoading = false;
  isEditMode = false;
  expositionId: string | null = null;
  imageUrls: string[] = [];

  constructor() {
    this.expositionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.maxLength(1000)]]
    });
  }

  ngOnInit(): void {
    // Check if we're in edit mode
    this.expositionId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.expositionId;

    if (this.isEditMode && this.expositionId) {
      this.loadExposition(this.expositionId);
    }
  }

  loadExposition(id: string): void {
    this.isLoading = true;
    this.cdr.detectChanges();

    this.expositionService.getById(id).subscribe({
      next: (exposition) => {
        this.expositionForm.patchValue({
          title: exposition.title,
          description: exposition.description
        });
        this.imageUrls = [...(exposition.images || [])];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading exposition:', error);
        this.snackBar.open('Failed to load exposition', 'Close', { duration: 3000 });
        this.router.navigate(['/expositions']);
      }
    });
  }

  addImageUrl(): void {
    const url = this.imageUrlControl.value?.trim();
    if (url && this.isValidImageUrl(url)) {
      this.imageUrls.push(url);
      this.imageUrlControl.setValue('');
    } else {
      this.snackBar.open('Please enter a valid image URL', 'Close', { duration: 3000 });
    }
  }

  removeImage(index: number): void {
    this.imageUrls.splice(index, 1);
  }

  isValidImageUrl(url: string): boolean {
    try {
      new URL(url);
      return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.includes('unsplash.com');
    } catch {
      return false;
    }
  }

  onSubmit(): void {
    if (this.expositionForm.valid) {
      this.isLoading = true;
      this.cdr.detectChanges();

      const formData = this.expositionForm.value;
      const currentUser = this.authService.currentUser;

      if (!currentUser) {
        this.snackBar.open('You must be logged in to create expositions', 'Close', { duration: 3000 });
        return;
      }

      if (this.isEditMode && this.expositionId) {
        this.updateExposition(formData);
      } else {
        this.createExposition(formData, currentUser.id);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createExposition(formData: any, userId: string): void {
    const expositionData: CreateExpositionDto = {
      title: formData.title,
      description: formData.description || '',
      images: this.imageUrls
    };

    this.expositionService.create(expositionData, userId).subscribe({
      next: (exposition) => {
        this.snackBar.open('Exposition created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/expositions', exposition.id]);
      },
      error: (error) => {
        console.error('Error creating exposition:', error);
        this.snackBar.open('Failed to create exposition', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateExposition(formData: any): void {
    const updateData: UpdateExpositionDto = {
      title: formData.title,
      description: formData.description || '',
      images: this.imageUrls
    };

    this.expositionService.update(this.expositionId!, updateData).subscribe({
      next: (exposition) => {
        this.snackBar.open('Exposition updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/expositions', this.expositionId]);
      },
      error: (error) => {
        console.error('Error updating exposition:', error);
        this.snackBar.open('Failed to update exposition', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.expositionId) {
      this.router.navigate(['/expositions', this.expositionId]);
    } else {
      this.router.navigate(['/expositions']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.expositionForm.controls).forEach(key => {
      const control = this.expositionForm.get(key);
      control?.markAsTouched();
    });
  }

  // Getter methods for form validation
  get titleControl() {
    return this.expositionForm.get('title');
  }

  get descriptionControl() {
    return this.expositionForm.get('description');
  }

  getTitleErrorMessage(): string {
    if (this.titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (this.titleControl?.hasError('minlength')) {
      return 'Title must be at least 3 characters';
    }
    return '';
  }

  getDescriptionErrorMessage(): string {
    if (this.descriptionControl?.hasError('maxlength')) {
      return 'Description cannot exceed 1000 characters';
    }
    return '';
  }
}
