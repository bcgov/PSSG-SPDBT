import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApplicationTypeCode } from '@app/api/models';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { SPD_CONSTANTS } from '@app/core/constants/constants';
import { FileUploadComponent } from './file-upload.component';

@Component({
	selector: 'app-form-mental-health-conditions',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12" [ngClass]="isWizardStep ? 'mx-auto' : ''">
					<mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
						<div [ngClass]="isWizardStep ? '' : 'd-flex justify-content-start'">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-divider class="my-2" *ngIf="isWizardStep"></mat-divider>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('isTreatedForMHC')?.dirty || form.get('isTreatedForMHC')?.touched) &&
							form.get('isTreatedForMHC')?.invalid &&
							form.get('isTreatedForMHC')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div class="row my-4" *ngIf="isTreatedForMHC.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
				<div [ngClass]="isWizardStep ? 'col-md-8 col-sm-12 mx-auto' : 'col-12'">
					<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
					<p>
						If you don't have a completed form, you can download and provide it to your physician to fill out, or your
						physician may download it and fill the form out on a computer if you provide them with the required
						information. See the
						<a aria-label="Navigate to Security Services Act site" [href]="securityServicesActUrl" target="_blank">
							Security Services Act</a
						>, s. 3, Security Services Regulation, s. 4(1)(e) for more information
					</p>
					<div class="text-minor-heading my-2">Upload your mental health condition form</div>
					<app-file-upload
						(fileUploaded)="onFileUploaded($event)"
						(fileRemoved)="onFileRemoved()"
						[control]="attachments"
						[maxNumberOfFiles]="1"
						[files]="attachments.value"
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
	standalone: false,
})
export class FormMentalHealthConditionsComponent {
	securityServicesActUrl = SPD_CONSTANTS.urls.securityServicesActUrl;
	booleanTypeCodes = BooleanTypeCode;

	@Input() form!: FormGroup;
	@Input() applicationTypeCode: ApplicationTypeCode | null = null;
	@Input() isWizardStep = false;

	@Output() fileUploaded = new EventEmitter<File>();
	@Output() fileRemoved = new EventEmitter();

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	onFileUploaded(file: File): void {
		this.fileUploaded.emit(file);
	}

	onFileRemoved(): void {
		this.fileRemoved.emit();
	}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}
	get hasPreviousMhcFormUpload(): FormControl {
		return this.form.get('hasPreviousMhcFormUpload') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
