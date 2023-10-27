import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { PoliceOfficerRoleCode } from 'src/app/api/models';
import { BooleanTypeCode, PoliceOfficerRoleTypes } from 'src/app/core/code-types/model-desc.models';
import { FormControlValidators } from 'src/app/core/validators/form-control.validators';
import { FormGroupValidators } from 'src/app/core/validators/form-group.validators';
import { FileUploadComponent } from 'src/app/shared/components/file-upload.component';
import { FormErrorStateMatcher } from 'src/app/shared/directives/form-error-state-matcher.directive';
import { LicenceApplicationService, LicenceChildStepperStepComponent } from '../licence-application.service';

@Component({
	selector: 'app-background-info',
	template: `
		<section class="step-section p-3">
			<div class="step">
				<app-step-title
					title="Confirm your background information"
					subtitle="Update any information that has changed since your last application"
				></app-step-title>
				<form [formGroup]="form" novalidate>
					<div class="step-container">
						<div class="row">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<div class="text-minor-heading mb-2">Your peace officer background</div>
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							</div>
						</div>
						<div class="row">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<div class="text-minor-heading mb-2">Your mental health condition</div>
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							</div>
						</div>

						<div class="row">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<div class="text-minor-heading mb-2">Your criminal history</div>
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
							</div>
						</div>

						<!-- <div class="col-xl-3 col-lg-4 col-md-6 col-sm-12 mx-auto">
							<mat-radio-group aria-label="Select an option" formControlName="isPoliceOrPeaceOfficer">
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.No">No</mat-radio-button>
								<mat-divider class="my-2"></mat-divider>
								<mat-radio-button class="radio-label" [value]="booleanTypeCodes.Yes">Yes</mat-radio-button>
							</mat-radio-group>
							<mat-error
								class="mat-option-error"
								*ngIf="
									(form.get('isPoliceOrPeaceOfficer')?.dirty || form.get('isPoliceOrPeaceOfficer')?.touched) &&
									form.get('isPoliceOrPeaceOfficer')?.invalid &&
									form.get('isPoliceOrPeaceOfficer')?.hasError('required')
								"
								>This is required</mat-error
							>
						</div>

						<div class="row my-4" *ngIf="isPoliceOrPeaceOfficer.value == booleanTypeCodes.Yes">
							<div class="offset-md-2 col-md-8 col-sm-12">
								<mat-divider class="mb-3 mat-divider-primary"></mat-divider>
								<div class="text-minor-heading mb-2">Your peace officer background</div>
								<div class="row mt-2">
									<div class="col-xl-6 col-lg-12 col-md-12 col-sm-12">
										<mat-form-field>
											<mat-select formControlName="officerRole">
												<mat-option *ngFor="let item of policeOfficerRoleTypes" [value]="item.code">
													{{ item.desc }}
												</mat-option>
											</mat-select>
											<mat-error *ngIf="form.get('officerRole')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
									<div
										class="col-xl-6 col-lg-12 col-md-12 col-sm-12"
										*ngIf="officerRole.value == policeOfficerRoleCodes.Other"
									>
										<mat-form-field>
											<mat-label>Describe Role</mat-label>
											<input matInput formControlName="otherOfficerRole" [errorStateMatcher]="matcher" maxlength="50" />
											<mat-error *ngIf="form.get('otherOfficerRole')?.hasError('required')">This is required</mat-error>
										</mat-form-field>
									</div>
								</div>
								<div class="row mt-2">
									<div class="col-12">
										<div class="text-minor-heading mb-2">
											Upload a letter of no conflict from your superior officer:
										</div>
										<p>
											The letter from your supervisor must confirm any access you have to justice, court or police
											information systems (PRIME/PIRS/PROS/CPIC or other police or corrections database). You cannot
											utilize information from these systems while acting in the capacity of a security worker. See
											Section 2.5.4 of the
											<a
												href="https://www2.gov.bc.ca/assets/gov/employment-business-and-economic-development/business-management/security-services/industry/legislation/licensingpolicy.pdf"
												target="_blank"
											>
												Security Licensing Process and Licence Conditions Policies</a
											>
											for more information.
										</p>

										<app-file-upload [maxNumberOfFiles]="1" onFilesChanged></app-file-upload>
										<mat-error
											class="mat-option-error"
											*ngIf="
												(form.get('attachments')?.dirty ||
													form.get('attachments')?.touched) &&
												form.get('attachments')?.invalid &&
												form.get('attachments')?.hasError('required')
											"
											>This is required</mat-error
										>
									</div>
								</div>
							</div>
						</div> -->
					</div>
				</form>
			</div>
		</section>
	`,
	styles: [],
})
export class BackgroundInfoComponent implements LicenceChildStepperStepComponent {
	booleanTypeCodes = BooleanTypeCode;
	policeOfficerRoleCodes = PoliceOfficerRoleCode;
	policeOfficerRoleTypes = PoliceOfficerRoleTypes;

	matcher = new FormErrorStateMatcher();

	form: FormGroup = this.formBuilder.group(
		{
			isPoliceOrPeaceOfficer: new FormControl(null, [FormControlValidators.required]),
			officerRole: new FormControl(),
			otherOfficerRole: new FormControl(),
			attachments: new FormControl(),
		},
		{
			validators: [
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'officerRole',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'otherOfficerRole',
					(form) => form.get('officerRole')?.value == PoliceOfficerRoleCode.Other
				),
				FormGroupValidators.conditionalDefaultRequiredValidator(
					'attachments',
					(form) => form.get('isPoliceOrPeaceOfficer')?.value == BooleanTypeCode.Yes
				),
			],
		}
	);

	@ViewChild(FileUploadComponent) fileUploadComponent!: FileUploadComponent;

	constructor(private formBuilder: FormBuilder, private licenceApplicationService: LicenceApplicationService) {}

	isFormValid(): boolean {
		this.onFilesChanged();

		this.form.markAllAsTouched();
		return this.form.valid;
	}

	onFilesChanged(): void {
		const attachments =
			this.fileUploadComponent?.files && this.fileUploadComponent?.files.length > 0
				? this.fileUploadComponent.files
				: [];
		this.form.controls['attachments'].setValue(attachments);
	}

	get isPoliceOrPeaceOfficer(): FormControl {
		return this.form.get('isPoliceOrPeaceOfficer') as FormControl;
	}

	get officerRole(): FormControl {
		return this.form.get('officerRole') as FormControl;
	}
}
