import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';
import { BusinessApplicationService } from '../../services/business-application.service';
import { LicenceChildStepperStepComponent } from '../../services/licence-application.helper';

@Component({
	selector: 'app-business-category-security-guard',
	template: `
		<form [formGroup]="form" novalidate>
			<div class="row">
				<div class="fs-5 lh-base mt-3 mb-2">
					Do you want to request authorization to use dogs for the purpose of security work?
				</div>
				<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12">
					<mat-radio-group aria-label="Select an option" formControlName="isRequestDogAuthorization">
						<div class="d-flex justify-content-start">
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
							<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
						</div>
					</mat-radio-group>
					<mat-error
						class="mat-option-error"
						*ngIf="
							(form.get('isRequestDogAuthorization')?.dirty || form.get('isRequestDogAuthorization')?.touched) &&
							form.get('isRequestDogAuthorization')?.invalid &&
							form.get('isRequestDogAuthorization')?.hasError('required')
						"
						>This is required</mat-error
					>
				</div>
			</div>

			<div class="my-4" *ngIf="isRequestDogAuthorization.value === booleanTypeCodes.Yes" @showHideTriggerSlideAnimation>
				<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

				<div class="text-minor-heading mb-2">Upload your Security Dog Validation Certificate</div>
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
		</form>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class BusinessCategorySecurityGuardComponent implements LicenceChildStepperStepComponent {
	form = this.businessApplicationService.categorySecurityGuardFormGroup;

	booleanTypeCodes = BooleanTypeCode;
	matcher = new FormErrorStateMatcher();

	constructor(private businessApplicationService: BusinessApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(_file: File): void {
		// TODO upload file on partial save
		this.businessApplicationService.hasValueChanged = true;

		if (this.businessApplicationService.isAutoSave()) {
			// this.businessApplicationService.addUploadDocument(LicenceDocumentTypeCode.xxx, file).subscribe({
			// 	next: (resp: any) => {
			// 		const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
			// 		matchingFile.documentUrlId = resp.body[0].documentUrlId;
			// 	},
			// 	error: (error: any) => {
			// 		console.log('An error occurred during file upload', error);
			// 		this.hotToastService.error('An error occurred during the file upload. Please try again.');
			// 		this.fileUploadComponent.removeFailedFile(file);
			// 	},
			// });
		}
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	get isRequestDogAuthorization(): FormControl {
		return this.form.get('isRequestDogAuthorization') as FormControl;
	}
	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
