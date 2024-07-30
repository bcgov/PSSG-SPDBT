import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { LicenceChildStepperStepComponent } from '@app/shared/services/common-application.helper';

@Component({
	selector: 'app-common-photograph-of-yourself',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row my-2">
				<div class="col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto">
					<app-alert type="warning" icon="warning">
						Uploading a photo that is dissimilar from your submitted government-issued photo ID will delay your
						application's processing time.
					</app-alert>

					<app-alert type="danger" icon="error" *ngIf="originalPhotoOfYourselfExpired">
						We require a new photo every 5 years. Please provide a new photo for your {{ label }}
					</app-alert>

					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="1"
						[files]="attachments.value"
						[accept]="accept"
						[previewImage]="true"
					></app-file-upload>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('attachments')?.dirty || form.get('attachments')?.touched) &&
							form.get('attachments')?.invalid &&
							form.get('attachments')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>
		</form>
	`,
	styles: [],
})
export class CommonPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	@Input() form!: FormGroup;
	@Input() label = 'licence'; // licence or permit
	@Input() originalPhotoOfYourselfExpired = false;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
