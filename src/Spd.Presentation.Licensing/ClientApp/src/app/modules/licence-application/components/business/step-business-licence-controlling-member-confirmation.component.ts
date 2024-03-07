import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { showHideTriggerSlideAnimation } from '@app/core/animations';
import { BooleanTypeCode } from '@app/core/code-types/model-desc.models';
import { BusinessApplicationService } from '@app/modules/licence-application/services/business-application.service';
import { LicenceChildStepperStepComponent } from '@app/modules/licence-application/services/licence-application.helper';

@Component({
	selector: 'app-step-business-licence-controlling-member-confirmation',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title title="Confirm the list of controlling members for this security business"></app-step-title>

				<form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
							<div class="mb-2">Current members with active security worker licences</div>
						</div>
					</div>

					<div class="row">
						<div class="col-xxl-8 col-xl-8 col-lg-12 mx-auto">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="mb-2">Members who require criminal record checks</div>
						</div>
					</div>

					<div class="row mt-2">
						<div class="offset-md-2 col-md-8 col-sm-12">
							<mat-divider class="my-3 mat-divider-primary"></mat-divider>
							<div class="mb-2">
								Upload a copy of the corporate registry documents for your business in the province in which you are
								originally registered
							</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="5"
								[files]="attachments.value"
							></app-file-upload>
						</div>
					</div>
				</form>

				<!-- <form [formGroup]="form" novalidate>
					<div class="row">
						<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="hasMembersWithoutSwl">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('hasMembersWithoutSwl')?.dirty || form.get('hasMembersWithoutSwl')?.touched) &&
									form.get('hasMembersWithoutSwl')?.invalid &&
									form.get('hasMembersWithoutSwl')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>
					</div>

					<div
						class="row mt-4"
						*ngIf="hasMembersWithoutSwl.value === booleanTypeCodes.Yes"
						@showHideTriggerSlideAnimation
					>
						<div class="col-xxl-8 col-xl-10 col-lg-8 col-md-8 col-sm-12 mx-auto">
							<mat-divider class="mb-3 mat-divider-primary"></mat-divider>

							<div class="text-minor-heading mb-2">Added Controlling Members</div>
						</div>
					</div>
				</form> -->
			</div>
		</section>
	`,
	styles: [],
	animations: [showHideTriggerSlideAnimation],
})
export class StepBusinessLicenceControllingMemberConfirmationComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.businessApplicationService.membersConfirmationFormGroup;

	constructor(private formBuilder: FormBuilder, private businessApplicationService: BusinessApplicationService) {}

	onFileUploaded(_file: File): void {
		// if (this.authenticationService.isLoggedIn()) {
		// 	this.permitApplicationService.addUploadDocument(LicenceDocumentTypeCode.ProofOfFingerprint, file).subscribe({
		// 		next: (resp: any) => {
		// 			const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
		// 			matchingFile.documentUrlId = resp.body[0].documentUrlId;
		// 		},
		// 		error: (error: any) => {
		// 			console.log('An error occurred during file upload', error);
		// 			this.hotToastService.error('An error occurred during the file upload. Please try again.');
		// 			this.fileUploadComponent.removeFailedFile(file);
		// 		},
		// 	});
		// }
	}

	onFileRemoved(): void {
		this.businessApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		// this.form.markAllAsTouched();
		// return this.form.valid;
		return true;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
