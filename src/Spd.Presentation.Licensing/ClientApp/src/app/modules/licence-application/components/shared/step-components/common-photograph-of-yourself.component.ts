import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';
import { showHideTriggerSlideAnimation } from 'src/app/core/animations';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';

@Component({
	selector: 'app-common-photograph-of-yourself',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row" *ngIf="!isAnonymous">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
					<mat-radio-group aria-label="Select an option" formControlName="useBcServicesCardPhoto">
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
						<mat-divider class="my-2" *ngIf="!isCalledFromModal"></mat-divider>
						<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('useBcServicesCardPhoto')?.dirty || form.get('useBcServicesCardPhoto')?.touched) &&
							form.get('useBcServicesCardPhoto')?.invalid &&
							form.get('useBcServicesCardPhoto')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div class="row my-2" *ngIf="useBcServicesCardPhoto.value === booleanTypeCodes.No" @showHideTriggerSlideAnimation>
				<div [ngClass]="isCalledFromModal ? 'col-12' : 'col-xxl-8 col-xl-10 col-lg-12 col-md-12 col-sm-12 mx-auto'">
					<ng-container *ngIf="!isAnonymous">
						<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
						<div class="text-minor-heading mb-2">Upload a photo of yourself</div>

						<p>
							This will appear on your {{ label }}. It must be a passport-quality photo of your face looking straight at
							the camera, against a plain, white background. It must be from within the last year.
						</p>
					</ng-container>

					<app-alert type="warning" icon="warning" *ngIf="!isCalledFromModal">
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
	animations: [showHideTriggerSlideAnimation],
})
export class CommonPhotographOfYourselfComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	accept = ['.jpeg', '.jpg', '.tif', '.tiff', '.png'].join(', ');

	@Input() form!: FormGroup;
	@Input() isAnonymous = false;
	@Input() label = 'licence'; // licence or permit
	@Input() originalPhotoOfYourselfExpired = false;
	@Input() isCalledFromModal = false;

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

	get useBcServicesCardPhoto(): FormControl {
		return this.form.get('useBcServicesCardPhoto') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
