import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LicenceDocumentTypeCode } from '@app/api/models';
import { GdsdApplicationService } from '@app/core/services/gdsd-application.service';
import { LicenceChildStepperStepComponent } from '@app/core/services/util.service';
import { FileUploadComponent } from '@app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from '@app/shared/directives/form-error-state-matcher.directive';

@Component({
	selector: 'app-step-gdsd-accredited-graduation',
	template: `
		<app-step-section
			title="Accredited Graduation Information"
			subtitle="Provide information about the accredited school your dog attended"
		>
			<form [formGroup]="form" novalidate>
				<div class="row">
					<div class="col-xl-8 col-lg-12 col-md-12 col-sm-12 mx-auto">
						<div class="row">
							<div class="col-12">
								<mat-form-field>
									<mat-label
										>Name of Assistance Dogs International or International Guide Dog Federation Accredited
										School</mat-label
									>
									<input
										matInput
										formControlName="accreditedSchoolName"
										[errorStateMatcher]="matcher"
										maxlength="250"
									/>
									<mat-error *ngIf="form.get('accreditedSchoolName')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Given Name <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="schoolContactGivenName"
										[errorStateMatcher]="matcher"
										maxlength="40"
									/>
								</mat-form-field>
							</div>
							<div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Surname</mat-label>
									<input matInput formControlName="schoolContactSurname" [errorStateMatcher]="matcher" maxlength="40" />
									<mat-error *ngIf="form.get('schoolContactSurname')?.hasError('required')">This is required</mat-error>
								</mat-form-field>
							</div>
							<div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Phone Number</mat-label>
									<input
										matInput
										formControlName="schoolContactPhoneNumber"
										[errorStateMatcher]="matcher"
										maxlength="30"
										appPhoneNumberTransform
									/>
									<mat-error *ngIf="form.get('schoolContactPhoneNumber')?.hasError('required')"
										>This is required</mat-error
									>
								</mat-form-field>
							</div>
							<div class="col-xxl-6 col-xl-6 col-lg-6 col-md-12">
								<mat-form-field>
									<mat-label>Contact Email Address <span class="optional-label">(optional)</span></mat-label>
									<input
										matInput
										formControlName="schoolContactEmailAddress"
										[errorStateMatcher]="matcher"
										placeholder="name@domain.com"
										maxlength="75"
									/>
									<mat-error *ngIf="form.get('schoolContactEmailAddress')?.hasError('email')">
										Must be a valid email address
									</mat-error>
								</mat-form-field>
							</div>

							<div class="text-minor-heading mt-3 mb-2">
								Attached written confirmation from the accredited training school that my dog and I have successfully
								completed the training program
							</div>
							<app-file-upload
								(fileUploaded)="onFileUploaded($event)"
								(fileRemoved)="onFileRemoved()"
								[control]="attachments"
								[maxNumberOfFiles]="10"
								[files]="attachments.value"
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
				</div>
			</form>
		</app-step-section>
	`,
	styles: [],
	standalone: false,
})
export class StepGdsdAccreditedGraduationComponent implements LicenceChildStepperStepComponent {
	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.gdsdApplicationService.accreditedGraduationFormGroup;

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private gdsdApplicationService: GdsdApplicationService) {}

	isFormValid(): boolean {
		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFileUploaded(file: File): void {
		this.gdsdApplicationService.fileUploaded(
			LicenceDocumentTypeCode.IdCardIssuedByAccreditedDogTrainingSchool,
			file,
			this.attachments,
			this.fileUploadComponent
		);
	}

	onFileRemoved(): void {
		this.gdsdApplicationService.fileRemoved();
	}

	get attachments(): FormControl {
		return this.form.get('attachments') as FormControl;
	}
}
