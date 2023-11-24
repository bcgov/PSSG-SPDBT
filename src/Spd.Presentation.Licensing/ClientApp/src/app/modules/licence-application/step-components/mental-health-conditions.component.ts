import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { LicenceDocumentTypeCode } from 'src/app/api/models';
import { BooleanTypeCode } from 'src/app/core/code-types/model-desc.models';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { LicenceChildStepperStepComponent } from '../licence-application.helper';
import { LicenceApplicationService } from '../licence-application.service';

@Component({
	selector: 'app-mental-health-conditions',
	template: `
		<section class="step-section">
			<div class="step">
				<app-step-title
					title="Have you been treated for any of the following Mental Health Conditions?"
					subtitle="An individual applying for a security worker licence must provide particulars of any mental health condition for which the individual has received treatment"
				></app-step-title>
				<div class="step-container">
					<form [formGroup]="form" novalidate>
						<div class="row">
							<div class="col-xxl-2 col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
								<mat-radio-group aria-label="Select an option" formControlName="isTreatedForMHC">
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
									<mat-divider class="my-2"></mat-divider>
									<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
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

						<div class="row my-4" *ngIf="isTreatedForMHC.value === booleanTypeCodes.Yes">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<p>
									If you don't have a completed form, you can download and provide it to your physician to fill out, or
									your physician may download it and fill the form out on a computer if you provide them with the
									required information. See the
									<a href="https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/07030_01" target="_blank">
										Security Services Act </a
									>, s. 3, Security Services Regulation, s. 4(1)(e) for more information
								</p>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">Upload your mental health condition form:</div>
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
							</div>
						</div>
					</form>
				</div>
			</div>
		</section>
	`,
	styles: [],
})
export class MentalHealthConditionsComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;

	form: FormGroup = this.licenceApplicationService.mentalHealthConditionsFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(
		private authenticationService: AuthenticationService,
		private licenceApplicationService: LicenceApplicationService,
		private hotToastService: HotToastService
	) {}

	onFileUploaded(file: File): void {
		if (this.authenticationService.isLoggedIn()) {
			this.licenceApplicationService.addUploadDocument(LicenceDocumentTypeCode.MentalHealthCondition, file).subscribe({
				next: (resp: any) => {
					const matchingFile = this.attachments.value.find((item: File) => item.name == file.name);
					matchingFile.documentUrlId = resp.body[0].documentUrlId;
				},
				error: (error: any) => {
					console.log('An error occurred during file upload', error);
					this.hotToastService.error('An error occurred during the file upload. Please try again.');
					this.fileUploadComponent.removeFailedFile(file);
				},
			});
		}
	}

	onFileRemoved(): void {
		this.licenceApplicationService.hasValueChanged = true;
	}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	get isTreatedForMHC(): FormControl {
		return this.form.get('isTreatedForMHC') as FormControl;
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
